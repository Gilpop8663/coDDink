import React from 'react';
import { cls } from '@libs/client/utils';

interface CategoryBtnProps {
  isSame: boolean;
  onClick: () => void;
  label: string;
}

export default function CategoryButton({
  isSame,
  onClick,
  label,
}: CategoryBtnProps) {
  return (
    <span
      onClick={onClick}
      className={cls(
        isSame
          ? 'cursor-pointer rounded-full bg-black py-2 px-4 text-sm font-semibold text-white'
          : 'cursor-pointer rounded-full bg-white py-2 px-4 text-sm font-semibold text-black transition-colors hover:bg-gray-100'
      )}>
      {label}
    </span>
  );
}
