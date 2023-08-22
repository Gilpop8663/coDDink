import React from 'react';
import { cls } from '@libs/client/utils';

interface TabMenuProps {
  isWatch: boolean;
  label: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export default function CategoryTabMenu({
  isWatch,
  label,
  onClick,
}: TabMenuProps) {
  return (
    <div
      onClick={onClick}
      className={cls(
        isWatch
          ? 'w-72 rounded-t-sm border-l-2 border-blue-600 bg-white py-2 pl-4 text-base font-semibold text-blue-600'
          : 'w-72 rounded-t-sm border-t bg-white py-2 pl-4 text-base text-black',
        'cursor-pointer transition-colors hover:bg-gray-100'
      )}>
      <span>{label}</span>
    </div>
  );
}
