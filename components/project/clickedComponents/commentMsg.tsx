import { makeImageURL, timeForToday } from "@libs/client/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CommentProps {
  id: string;
  avatar: string;
  name: string;
  createdAt: Date;
  comment: string;
  currentUserId: number | undefined;
  onCommentDeleteClick: () => void;
}

export default function CommentMsg({
  id,
  avatar,
  name,
  createdAt,
  comment,
  currentUserId,
  onCommentDeleteClick,
}: CommentProps) {
  return (
    <div className="">
      <div className="flex  justify-between">
        <div className="item-center flex w-full">
          <Link href={`/profile/${id}`}>
            <a className="relative mr-4 flex h-8 w-8 rounded-full">
              <Image
                src={makeImageURL(avatar, "smAvatar")}
                alt="avatar"
                layout="fill"
                className="rounded-full"
              ></Image>
            </a>
          </Link>
          <div className="flex w-full flex-col">
            <div className="flex items-center space-x-1">
              <Link href={`/profile/${id}`}>
                <a className="cursor-pointer text-sm font-semibold text-gray-800 hover:underline">
                  {name}
                </a>
              </Link>
              <span className="text-xs text-gray-300">&bull;</span>
              <h6 className="text-xs text-gray-300">
                {timeForToday(createdAt)}
              </h6>
            </div>
            <span className="mt-2 overflow-auto text-sm">{comment}</span>
          </div>
        </div>
        {currentUserId === +id && (
          <svg
            onClick={onCommentDeleteClick}
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 cursor-pointer text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
