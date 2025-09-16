import { InputProps } from '@/types/Types';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const InputField = ({ label, name, placeholder, type = 'text', className }: InputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm">
        {label} *
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === 'text' ? (
            <input
              {...field}
              id={name}
              type="text"
              placeholder={placeholder}
              className={`border py-2 px-3 text-sm shadow rounded-md w-full ${className} placeholder:text-sm outline-none`}
            />
          ) : (
            <textarea
              {...field}
              id={name}
              rows={5}
              placeholder={placeholder}
              className={`resize-none border py-2 px-3 text-sm shadow rounded-md w-full ${className} placeholder:text-sm outline-none`}
            />
          )
        }
      />
      {errors[name]?.message && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message as string}</p>
      )}
    </div>
  );
};

export default InputField;
