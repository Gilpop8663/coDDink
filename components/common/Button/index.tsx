import React from 'react';
import { cls } from '@libs/client/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'blue' | 'green' | 'white' | 'gray' | 'red' | 'disabled';
  text: string;
  hoverText?: string;
  py?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg';
}

const BUTTON_STYLES: Record<ButtonProps['color'], string> = {
  white: 'bg-gray-50 text-gray-400 hover:underline',
  blue: 'bg-blue-500 text-white  hover:bg-blue-600',
  disabled: 'bg-gray-200 text-white select-none',
  gray: 'bg-gray-50 text-black bg-white hover:bg-gray-100',
  red: 'bg-white text-black  hover:bg-red-600 hover:text-white',
  green: 'text-white bg-green-600 hover:bg-green-700',
};

export default function Button({
  color,
  text,
  size = 'base',
  py = '1',
  hoverText = text,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cls(
        `text-${size} ${BUTTON_STYLES[color]} ${
          color === 'disabled' ? 'cursor-not-allowed' : 'cursor-pointer'
        } py-${py}`,
        'group relative flex w-full  items-center justify-center rounded-full px-2 font-semibold transition-colors'
      )}
      {...rest}
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
