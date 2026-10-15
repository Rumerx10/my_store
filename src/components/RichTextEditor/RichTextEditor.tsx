'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import type { EditorView } from '@tiptap/pm/view';
import toast from 'react-hot-toast';
import { isImageFile, readImageFile } from '@/lib/imageFile';
import { sanitizeHtml } from '@/lib/richText';
import { cn } from '@/lib/utils';
import { createExtensions } from './extensions';
import Toolbar from './Toolbar';

// Puts each block on its own line so the HTML view is readable.
const formatHtml = (html: string) =>
  html.replace(/(<\/(p|h[2-4]|ul|ol|li|blockquote|pre)>|<hr>|<img[^>]*>)/g, '$1\n').trim();

// Reads image files and inserts them at `pos`, or at the cursor when no position is given.
const insertImageFiles = async (view: EditorView, files: File[], pos?: number) => {
  for (const file of files) {
    try {
      const src = await readImageFile(file);
      const node = view.state.schema.nodes.image.create({ src, alt: '' });
      const tr =
        pos === undefined
          ? view.state.tr.replaceSelectionWith(node)
          : view.state.tr.insert(Math.min(pos, view.state.doc.content.size), node);
      view.dispatch(tr);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Couldn't add ${file.name}.`);
    }
  }
};

const imageFilesFrom = (list: FileList | null | undefined) =>
  Array.from(list ?? []).filter(isImageFile);

export default function RichTextEditor({
  id,
  value,
  onChange,
  onBlur,
  placeholder = 'Write a description…',
  labelledBy,
  describedBy,
  invalid = false,
}: {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  labelledBy?: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  const [sourceMode, setSourceMode] = useState(false);
  const [source, setSource] = useState('');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const extensions = useMemo(() => createExtensions(placeholder), [placeholder]);

  const attributes: Record<string, string> = {
    class: 'rich-text',
    role: 'textbox',
    'aria-multiline': 'true',
    'aria-invalid': invalid ? 'true' : 'false',
  };
  if (id) attributes.id = id;
  if (labelledBy) attributes['aria-labelledby'] = labelledBy;
  if (describedBy) attributes['aria-describedby'] = describedBy;

  const editor = useEditor(
    {
      extensions,
      content: value,
      // Render on the client only, so server and client HTML match.
      immediatelyRender: false,
      editorProps: {
        attributes,
        handlePaste: (view, event) => {
          const files = imageFilesFrom(event.clipboardData?.files);
          if (files.length === 0) return false;
          event.preventDefault();
          void insertImageFiles(view, files);
          return true;
        },
        handleDrop: (view, event, _slice, moved) => {
          const files = imageFilesFrom(event.dataTransfer?.files);
          if (moved || files.length === 0) return false;
          event.preventDefault();
          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
          void insertImageFiles(view, files, pos);
          return true;
        },
      },
      onUpdate: ({ editor: e }) => onChangeRef.current(e.isEmpty ? '' : e.getHTML()),
      onBlur: () => onBlur?.(),
    },
    [extensions],
  );

  // Keep editor attributes (aria-invalid, ids) in sync with the form.
  useEffect(() => {
    editor?.setOptions({ editorProps: { ...editor.options.editorProps, attributes } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, invalid, id, labelledBy, describedBy]);

  // Outside changes, like Discard or loading another product, replace the content.
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? '' : editor.getHTML();
    if (value !== current) editor.commands.setContent(value || '', { emitUpdate: false });
  }, [editor, value]);

  const words = useEditorState({
    editor,
    selector: ({ editor: e }) => (e ? e.storage.characterCount.words() : 0),
  });

  const toggleSource = () => {
    if (!editor) return;
    if (sourceMode) {
      const clean = sanitizeHtml(source);
      editor.commands.setContent(clean, { emitUpdate: true });
      setSourceMode(false);
      editor.commands.focus();
    } else {
      setSource(formatHtml(editor.isEmpty ? '' : editor.getHTML()));
      setSourceMode(true);
    }
  };

  return (
    <div
      className={cn(
        'rich-text-editor rounded-xl border bg-white/90 transition-[border-color,box-shadow] focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/15',
        invalid ? 'border-red' : 'border-gray-300',
      )}
    >
      <Toolbar
        editor={editor}
        sourceMode={sourceMode}
        onToggleSource={toggleSource}
        onUploadImages={(files) => {
          if (editor) void insertImageFiles(editor.view, imageFilesFrom(files));
        }}
      />

      {sourceMode ? (
        <textarea
          value={source}
          onChange={(event) => {
            setSource(event.target.value);
            onChangeRef.current(sanitizeHtml(event.target.value));
          }}
          spellCheck={false}
          aria-label="Description HTML"
          className="block min-h-56 w-full resize-y bg-slate-950/95 px-4 py-4 font-mono text-[13px] leading-relaxed text-slate-100 outline-none md:px-5"
        />
      ) : editor ? (
        <EditorContent editor={editor} />
      ) : (
        // Placeholder with the editor's height while it loads on the client.
        <div className="min-h-56 px-4 py-4 text-gray-400 md:px-5">{placeholder}</div>
      )}

      <div className="flex items-center justify-between gap-3 rounded-b-xl border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
        <span>
          {sourceMode
            ? 'Editing HTML. Unsupported tags are removed when you switch back.'
            : 'Paste or drop images straight into the text.'}
        </span>
        <span className="shrink-0 tabular-nums">
          {words} {words === 1 ? 'word' : 'words'}
        </span>
      </div>
    </div>
  );
}
