import React, { useRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  register?: UseFormRegisterReturn;
  type: string;
  placeholder?: string;
  required?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

export default function Input({
  label,
  name,
  type,
  register,
  required = false,
  placeholder,
  onClick,
  ...rest
}: InputProps) {
  return (
    <div className="mt-4">
      <label className="mt-8 text-xs" htmlFor={name}>
        {label}
      </label>
      <input
        required={required}
        placeholder={placeholder}
        {...register}
        id={name}
        type={type}
        className="w-full border-b-2 py-2 transition-colors hover:border-black/50 focus:border-blue-500 focus:outline-none"
        {...rest}
      />
    </div>
  );
}
