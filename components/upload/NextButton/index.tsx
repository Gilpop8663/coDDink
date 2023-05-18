import React from 'react';
import { cls } from '@libs/client/utils';

interface UploadProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'blue' | 'green' | 'white' | 'gray' | 'red' | 'disabled';
  text: string;
  hoverText?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg';
}

const NEXT_BUTTON_STYLES: Record<UploadProps['color'], string> = {
  white: 'bg-gray-50 text-gray-400 hover:underline',
  blue: 'bg-blue-600 text-white  hover:bg-blue-700',
  disabled: 'bg-gray-200 text-white select-none',
  gray: 'bg-gray-50 text-black bg-white hover:bg-gray-100',
  red: 'bg-white text-black  hover:bg-red-600 hover:text-white',
  green: 'text-white bg-green-600 hover:bg-green-700',
};

export default function NextButton({
  color,
  text,
  size = 'base',
  hoverText,
  ...rest
}: UploadProps) {
  return (
    <button
      {...rest}
      className={cls(
        `text-${size} ${NEXT_BUTTON_STYLES[color]} ${
          color === 'disabled' ? 'cursor-not-allowed' : 'cursor-pointer'
        }`,
        'cursor group relative flex w-full  items-center justify-center rounded-full py-1 px-2 font-semibold transition-colors'
      )}
    >
      <span className="text-center group-hover:invisible group-hover:absolute">
        {text}
      </span>
      <span className="invisible absolute text-center group-hover:visible group-hover:relative">
        {hoverText}
      </span>
    </button>
  );
}
