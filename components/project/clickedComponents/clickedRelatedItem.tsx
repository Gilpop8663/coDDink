import { cls, makeImageURL } from "@libs/client/utils";
import Image from "next/image";
import Link from "next/link";
import { ProjectWithCountWithUser } from "pages";
import React, { useState } from "react";

interface RelatedProps {
  data: ProjectWithCountWithUser;
  onClick: () => void;
}

export default function ClickedRelatedItem({ data, onClick }: RelatedProps) {
  const [isContentTouch, setIsContentTouch] = useState(false);
  const onContentTouch = () => {
    setIsContentTouch((prev) => !prev);
  };

  return (
    <div
      className="relative col-span-1 w-full cursor-pointer "
      onClick={onClick}
      onMouseOver={onContentTouch}
      onMouseOut={onContentTouch}
    >
      <div className="relative h-64">
        <Image
          alt="thumbnail"
          src={makeImageURL(data.thumbnail, "public")}
          layout="fill"
          className="rounded-md object-cover"
        ></Image>
      </div>
      {isContentTouch && (
        <div className="absolute bottom-0 flex h-28 w-full items-end rounded-md bg-gradient-to-t from-black/80 to-gray-600/0 px-4">
          <div className="flex w-full flex-col">
            <span className="relative top-2 font-semibold text-white hover:underline">
              {data.title}
            </span>
            <div className="flex w-full items-center justify-between py-4">
              {data.owner.length > 1 ? (
                <span className="text-sm text-white">여러 소유자</span>
              ) : (
                <Link href={`/profile/${data.owner[0]?.userId}`}>
                  <a className="text-sm text-white hover:underline">
                    {data.owner[0]?.name}
                  </a>
                </Link>
              )}

              <div className="flex items-center space-x-2 text-white">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="ml-1 text-xs font-semibold text-white">
                    {data._count.like}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
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
                  <span className="ml-1 text-xs font-semibold text-white">
                    {1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
