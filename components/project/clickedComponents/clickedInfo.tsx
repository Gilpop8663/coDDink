import { cls } from "@libs/client/utils";
import Link from "next/link";
import React, { useState } from "react";

interface ItemProps {
  kind: "footer" | "sidebar";
  title: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: Date;
  description?: string;
  projectURL?: string;
}

export default function ClickedInfo({
  kind,
  title,
  createdAt,
  likes,
  views,
  comments,
  projectURL,
  description,
}: ItemProps) {
  const [isDetail, setIsDetail] = useState(false);
  const year = new Date(createdAt).getFullYear();
  const month = new Date(createdAt).getMonth() + 1;
  const day = new Date(createdAt).getDate();

  const onDescriptionClick = () => {
    setIsDetail((prev) => !prev);
  };
  return (
    <>
      {kind === "sidebar" && (
        <div className="mb-4 flex flex-col space-y-4">
          <h4 className="text-base font-semibold text-black">{title}</h4>
          {projectURL && (
            <a
              title="링크 이동하기"
              href={
                projectURL.includes("https")
                  ? projectURL
                  : `https://${projectURL}`
              }
              target="noreferrer"
              className="break-all text-sm font-semibold text-blue-600"
            >
              {projectURL}
            </a>
          )}
          <p className="break-all text-sm text-gray-600">
            {isDetail ? description : `${description?.slice(0, 100)}...`}
          </p>
          {description && description?.length > 100 && (
            <span
              onClick={onDescriptionClick}
              className="cursor-pointer text-xs font-semibold text-gray-500"
            >
              {isDetail ? "간단히 보기" : "자세히 보기"}
            </span>
          )}
        </div>
      )}
      {kind === "footer" && (
        <h4 className="mt-4 text-2xl font-semibold text-white">{title}</h4>
      )}
      <div
        className={cls(
          kind === "sidebar" ? "text-gray-500" : "text-gray-400",
          "mt-1 flex space-x-2"
        )}
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span className="ml-1 text-sm">{likes}</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-1 text-sm">{views}</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
          <span className="ml-1 text-sm">{comments}</span>
        </div>
      </div>
      <div className="mt-6 text-xs text-gray-400">
        <span>게시:</span>
        <span>
          {year}년 {month}월 {day}일
        </span>
      </div>
    </>
  );
}
