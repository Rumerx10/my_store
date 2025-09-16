'use client';

import { InputProps } from '@/types/Types';
import { Controller, useFormContext } from 'react-hook-form';
import { useQuill } from './../../node_modules/react-quilljs/esm/index';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // text styles
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // headers
    [{ list: 'ordered' }, { list: 'bullet' }], // lists
    [{ indent: '-1' }, { indent: '+1' }], // indentation
    [{ align: [] }], // alignment
    ['blockquote', 'code-block'], // block types
    [{ color: [] }, { background: [] }], // colors
    ['link', 'image', 'video'], // media
    ['clean'], // remove formatting
  ],
};

const QuillDescriptionField = ({
  label,
  name,
  placeholder,
  type = 'text',
  className,
}: InputProps) => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm">
        {label} *
      </label>
      <Controller
        name="desc"
        control={control}
        render={({ field }) => {
          const { quillRef } = useQuill({
            theme: 'snow',
            modules,
          });
          return (
            <div
              ref={quillRef}
              onBlur={() => field.onChange(quillRef.current.firstChild.innerHTML)}
              className="border-2 min-h-50"
            />
          );
        }}
      />
    </div>
  );
};

export default QuillDescriptionField;
