import React from 'react';
import { cls } from '@libs/client/utils';

interface ButtonProps {
  color: 'blue' | 'white';
  icon: string;
  label: string;
}

export default function InteractionButton({ color, label, icon }: ButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cls(
          color === 'blue'
            ? 'bg-blue-600 text-white'
            : 'border bg-white text-black',
          'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full'
        )}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path d={icon} />
        </svg>
      </div>
      <div className="mt-2 text-xs font-semibold text-gray-500">{label}</div>
    </div>
  );
}
