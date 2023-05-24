import React, { PropsWithChildren } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Image from 'next/image';
import { cls } from '@libs/client/utils';

interface UploadButtonProps extends PropsWithChildren {}

interface UploadButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  color: 'skyBlue' | 'orange' | 'blue';
  name: string;
  type?: 'file' | 'none';
  text?: string;
  register?: UseFormRegisterReturn;
  previewImage?: string;
  kind?: 'circle' | 'button' | 'hidden';
  subText?: string;
  borderRight?: boolean;
  innerText?: string;
}

const BUTTON_STYLES: Record<UploadButtonProps['color'], string> = {
  skyBlue: 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white',
  orange: 'bg-orange-200',
  blue: 'bg-blue-500 text-white  hover:bg-blue-600',
};

export default function UploadButton({
  color,
  name,
  text,
  type = 'file',
  subText,
  innerText,
  children,
  borderRight,
  onChange,
  register,
  kind = 'circle',
  onClick,
  previewImage,
}: UploadButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <label
        htmlFor={name}
        className={cls(
          `${borderRight ? 'border-r  pr-8' : ''} ${
            kind === 'button' ? 'w-full' : ''
          } `,

          'flex flex-col '
        )}
      >
        {previewImage ? (
          <div className="relative h-24 w-24">
            <Image
              src={previewImage}
              layout="fill"
              alt="previewAvatar"
              className="h-24 w-24 cursor-pointer rounded-full "
            />
          </div>
        ) : (
          <div
            onClick={onClick}
            className={cls(
              `${BUTTON_STYLES[color]} ${
                kind === 'circle' ? 'h-24 w-24' : 'w-full py-1'
              } ${kind === 'hidden' ? 'hidden' : ''}`,
              'flex cursor-pointer items-center justify-center  rounded-full  transition-colors duration-200'
            )}
          >
            {innerText && (
              <div className="text-center text-sm font-semibold">
                {innerText}
              </div>
            )}
            {children}
          </div>
        )}
        {subText && (
          <div className="mt-2 flex cursor-pointer items-center text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-sm">{subText}</div>
          </div>
        )}
        <input
          multiple
          onChange={onChange}
          id={name}
          className="hidden"
          type={type}
          accept="image/*"
          {...register}
        />
      </label>
      <span className="mt-4 text-sm font-semibold">{text}</span>
    </div>
  );
}
