import React, { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface UploadProps {
  label: string;
  name: string;
  register?: UseFormRegisterReturn;
  type: string;
  placeholder?: string;
  required?: boolean;
  subLabel?: string;
  onClick?: () => void;
}

export default function UploadInput({
  label,
  name,
  required,
  type,
  subLabel,
  placeholder,
  onClick,
  register,
}: UploadProps) {
  return (
    <div className="mt-4">
      <label className="mt-8 text-xs font-semibold" htmlFor={name}>
        {label}
        <span className="ml-2 text-gray-400">{subLabel}</span>
      </label>
      <input
        required={required}
        placeholder={placeholder}
        {...register}
        id={name}
        type={type}
        className="mt-2 w-full rounded-sm border py-3 px-2 text-xs font-semibold text-black placeholder:text-xs placeholder:text-gray-500 focus:border-blue-600 focus:outline-none"
      />
    </div>
  );
}
