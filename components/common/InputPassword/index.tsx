import React, {  useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register?: UseFormRegisterReturn;
}

export default function InputPassword({
  label,
  name,
  register,
  ...rest
}: InputProps) {
  const [isBlind, setIsBlind] = useState(true);
  const onIconClick = () => {
    setIsBlind((prev) => !prev);
  };
  return (
    <div className="mt-4">
      <label className="mt-8 text-xs" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          {...register}
          type={isBlind == true ? 'password' : 'text'}
          className="w-full border-b-2 py-2 transition-colors hover:border-black/50 focus:border-blue-500 focus:outline-none"
          {...rest}
        />
        {isBlind == false ? (
          <svg
            onClick={onIconClick}
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-3 right-0 h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ) : (
          <svg
            onClick={onIconClick}
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-3 right-0 h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
