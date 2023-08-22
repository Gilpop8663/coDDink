import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register?: UseFormRegisterReturn;
}

export default function Input({
  label,
  name,
  register,
  onChange,
  type,
  ...rest
}: InputProps) {
  return (
    <div className="mt-4">
      <label className="mt-8 text-xs" htmlFor={name}>
        {label}
      </label>
      {type === 'file' ? (
        <input
          {...register}
          onChange={onChange}
          id={name}
          className="hidden"
          type="file"
          accept="image/*"
          {...rest}
        />
      ) : (
        <input
          {...register}
          id={name}
          className="w-full border-b-2 py-2 transition-colors hover:border-black/50 focus:border-blue-500 focus:outline-none"
          {...rest}
        />
      )}
    </div>
  );
}
