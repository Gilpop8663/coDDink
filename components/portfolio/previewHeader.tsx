import React from 'react';
import Image from 'next/image';
import { cls, makeImageURL } from '@libs/client/utils';

interface ItemProps {
  title: string;
  name: string | null | undefined;
  avatar: string | null | undefined;
}

export default function PreviewHeader({ title, avatar, name }: ItemProps) {
  return (
    <div className={cls('text-white', 'flex')}>
      <div className="mb-5 flex items-center">
        <div>
          <Image
            src={makeImageURL(avatar!)}
            className="cursor-pointer rounded-full hover:opacity-90"
            height={40}
            width={40}
            alt="profile"
          ></Image>
        </div>
        <div className="ml-3 flex flex-col">
          <span className="font-semibold">{title}</span>
          <div className="flex items-center space-x-2 text-sm">
            <span>{name}</span>
            <span>&bull;</span>
            <span className="cursor-pointer hover:underline">팔로우</span>
          </div>
        </div>
      </div>
    </div>
  );
}
