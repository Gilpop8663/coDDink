import React from 'react';
import Link from 'next/link';
import { cls } from '@libs/client/utils';
import ClickedInfo from '@components/project/clickedComponents/clickedInfo';

interface ItemProps {
  title: string;
  likes: number;
  views: number;
  createdAt: Date;
  isLiked: boolean;
  comments: number;
}

export default function PreviewFooter({
  title,
  likes,
  views,
  createdAt,
  comments,
  isLiked,
}: ItemProps) {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center bg-black">
      <span className="text-lg text-white"></span>
      <div
        className={cls(
          'flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full text-white hover:opacity-90',
          'bg-blue-700'
        )}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cls(isLiked ? 'h-5 w-5' : 'h-8 w-8')}
          viewBox="0 0 20 20"
          fill="currentColor">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
        {isLiked && <span className="text-xs font-semibold ">{likes}</span>}
      </div>
      <ClickedInfo
        kind="footer"
        comments={comments}
        title={title}
        likes={likes}
        views={views}
        createdAt={createdAt}></ClickedInfo>
    </div>
  );
}
