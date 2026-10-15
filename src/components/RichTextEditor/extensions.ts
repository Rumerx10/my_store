import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageView from './ImageView';

// Block image with a width (percent of the text column) and an alignment.
// Saved as <img style="width: 50%" data-align="center">, which the storefront styles.
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const match = element.style.width.match(/^(\d+(?:\.\d+)?)%$/);
          return match ? Math.min(100, Math.max(10, Math.round(Number(match[1])))) : null;
        },
        renderHTML: (attributes: { width: number | null }) =>
          attributes.width ? { style: `width: ${attributes.width}%` } : {},
      },
      align: {
        default: 'center',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-align') ?? 'center',
        renderHTML: (attributes: { align: string }) => ({ 'data-align': attributes.align }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

export const createExtensions = (placeholder: string) => [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer nofollow' },
    },
  }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  ResizableImage.configure({ inline: false, allowBase64: true, resize: false }),
  Placeholder.configure({ placeholder }),
  CharacterCount,
];
