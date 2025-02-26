import React, { useEffect, useRef, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Image from 'next/image';
import { makeImageURL } from '@libs/client/utils';
import { UserDataProps } from '@hooks/useCreatePortfolio';
import UploadTagValue from '@components/portfolio/uploadTagValue';

interface UploadProps {
  label: string;
  name: string;
  register?: UseFormRegisterReturn;
  type: string;
  placeholder?: string;
  required?: boolean;
  subLabel?: string;
  onClick?: () => void;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
  contentArr?: string[];
  userArr?: UserDataProps[];
  userData?: UserDataProps[];
  deleteContentTags?: (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    kind: 'tags' | 'category' | 'tools' | 'owner' | string,
    idx: number
  ) => void;
  onUserClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: UserDataProps
  ) => void;
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
  onKeyPress,
  contentArr,
  deleteContentTags,
  userData,
  onUserClick,
  userArr,
}: UploadProps) {
  const curRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (curRef.current === null) return;
    curRef.current.addEventListener('focusout', () => {
      setTimeout(() => {
        setIsOver(false);
      }, 300);
    });
    curRef.current.addEventListener('focusin', () => {
      setIsOver(true);
    });
  }, []);

  return (
    <div ref={curRef} className="relative mt-4">
      <label className="mt-8 text-xs font-semibold" htmlFor={name}>
        {label}
        <span className="ml-2 text-gray-400">{subLabel}</span>
      </label>
      {/* <input
        onKeyDown={onKeyPress}
        required={required}
        placeholder={placeholder}
        {...register}
        id={name}
        type={type}
        className="mt-2 w-full rounded-sm border py-3 px-2 text-xs font-semibold text-black placeholder:text-xs placeholder:text-gray-500 focus:border-blue-600 focus:outline-none"
      /> */}
      <div className=" relative mt-2 flex flex-wrap  space-x-2  rounded-sm border py-3 px-2 text-xs focus-within:border-blue-600 hover:border-blue-600 active:border-blue-600">
        {contentArr &&
          contentArr.map((item, idx) => (
            <UploadTagValue
              key={idx}
              value={item}
              onClick={(e) => deleteContentTags!(e, name, idx)}
            ></UploadTagValue>
          ))}
        {userArr &&
          userArr.map((item, idx) => (
            <UploadTagValue
              key={idx}
              value={item.name}
              onClick={(e) => deleteContentTags!(e, name, idx)}
            ></UploadTagValue>
          ))}
        <input
          autoComplete="off"
          onKeyDown={onKeyPress}
          required={required}
          placeholder={contentArr && contentArr.length > 0 ? '' : placeholder}
          {...register}
          id={name}
          type={type}
          className="w-fit min-w-full text-xs font-semibold focus:outline-none"
        />
      </div>
      {userData && isOver && (
        <div className="absolute w-full border bg-white p-2 shadow-md ">
          {userData.map((item) => (
            <div
              onClick={(e) => onUserClick!(e, item)}
              className="flex cursor-pointer items-center py-1 px-2 transition-colors hover:bg-blue-600 hover:text-white"
              key={item.id}
            >
              <div className="relative h-10 w-10">
                <Image
                  src={makeImageURL(item.avatar!)}
                  layout="fill"
                  className="rounded-full"
                  alt="avater"
                ></Image>
              </div>
              <span className="text-gray-80 ml-2 font-semibold">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
