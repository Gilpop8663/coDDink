import React, { ChangeEvent, useState } from 'react';
import { cls } from '@libs/client/utils';

interface UploadProps {
  color:
    | 'blueBtn'
    | 'greenBtn'
    | 'whiteDiv'
    | 'grayBtn'
    | 'greenDiv'
    | 'blueDiv'
    | 'followDelBtn'
    | 'disabled';
  label: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
  size?: 'sm' | 'base' | 'xs' | 'lg';
}

export default function NextButton({
  color,
  label,
  onChange,
  onClick,
  size = 'base',
}: UploadProps) {
  const [isOver, setIsOver] = useState(false);
  const onMouseOver = () => {
    setIsOver((prev) => !prev);
  };
  return (
    <>
      {color === 'whiteDiv' && (
        <div
          className={cls(
            `text-${size}`,
            ' flex w-full cursor-pointer justify-center rounded-full  py-1 px-2 font-semibold text-gray-400 transition-colors hover:underline'
          )}
          onClick={onClick}
        >
          {label}
        </div>
      )}
      {color === 'blueBtn' && (
        <button
          className={cls(
            `text-${size}`,
            'flex w-full cursor-pointer justify-center rounded-full bg-blue-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-blue-700'
          )}
          onClick={onClick}
        >
          {label}
        </button>
      )}
      {color === 'blueDiv' && (
        <div
          className={cls(
            `text-${size}`,
            'flex w-full cursor-pointer justify-center rounded-full bg-blue-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-blue-700'
          )}
          onClick={onClick}
        >
          {label}
        </div>
      )}
      {color === 'greenBtn' && (
        <button
          className={cls(
            `text-${size}`,
            'flex w-full cursor-pointer justify-center rounded-full bg-green-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-green-700'
          )}
          onClick={onClick}
        >
          {label}
        </button>
      )}

      {color === 'greenDiv' && (
        <div
          className={cls(
            `text-${size}`,
            'flex w-full cursor-pointer justify-center rounded-full bg-green-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-green-700'
          )}
          onClick={onClick}
        >
          {label}
        </div>
      )}
      {color === 'disabled' && (
        <div
          className={cls(
            `text-${size}`,
            'transition-color flex w-full select-none justify-center rounded-full bg-gray-200 py-1 px-2 font-semibold text-white'
          )}
          draggable={false}
          onClick={onClick}
        >
          {label}
        </div>
      )}

      {color === 'grayBtn' && (
        <button
          className={cls(
            `text-${size}`,
            'flex w-full cursor-pointer justify-center rounded-full border  bg-white py-1 px-2 font-semibold text-black transition-colors hover:bg-gray-100'
          )}
          onClick={onClick}
        >
          {label}
        </button>
      )}
      {color === 'followDelBtn' && (
        <button
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOver}
          className={cls(
            `text-${size}`,

            'flex w-full cursor-pointer justify-center rounded-full border bg-white  py-1 px-2 font-semibold text-black transition-colors hover:bg-red-600 hover:text-white'
          )}
          onClick={onClick}
        >
          {isOver ? '팔로우 취소' : '팔로잉'}
        </button>
      )}
    </>
  );
}
