import { cls } from "@libs/client/utils";
import Image from "next/image";
import React, { useState } from "react";

interface PreviewImageProps {
  src: string;
  idx: number;
  onClearClick: (idx: number) => void;
}

export default function PreviewImage({
  src,
  idx,
  onClearClick,
}: PreviewImageProps) {
  const [isEditOver, setIsEditOver] = useState(false);
  const [isCreateOver, setIsCreateOver] = useState(false);
  const onCreateHover = () => {
    setIsCreateOver((prev) => !prev);
  };
  const onEditHover = () => {
    setIsEditOver((prev) => !prev);
  };
  return (
    <>
      <div
        onMouseOver={onCreateHover}
        onMouseOut={onCreateHover}
        className=" flex h-8 items-center justify-center  border border-dashed border-white transition-all hover:border-blue-600"
      >
        {isCreateOver && (
          <div className="z-10 flex items-center space-x-3 rounded-md bg-gray-900 py-2 px-8 text-white">
            <span>미디어 삽입:</span>
            <div className="cursor-pointer rounded-md p-1 hover:bg-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="cursor-pointer rounded-md p-1 hover:bg-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <div className="cursor-pointer rounded-md p-1 hover:bg-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="relative h-5/6 w-full border-blue-600 hover:border">
        <div
          className={cls(
            isEditOver ? "ring-1 ring-blue-600 " : "",
            "absolute -left-2 -top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md"
          )}
          onClick={onEditHover}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className=" h-5 w-5 "
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
        {isEditOver && (
          <div className="absolute -left-2 top-6 z-10 flex flex-col space-y-1 rounded-md border bg-white py-2 text-sm shadow-md">
            {/* <span className="px-3 py-1 hover:bg-blue-600 hover:text-white">
            프로젝트 순서 변경
            </span>
            <span className="px-3 py-1 hover:bg-blue-600 hover:text-white">
            Image 바꾸기
          </span> */}
            <span
              onClick={() => onClearClick(idx)}
              className="cursor-pointer px-3 py-1 hover:bg-blue-600 hover:text-white"
            >
              Image 삭제
            </span>
          </div>
        )}

        <Image
          src={src}
          layout="fill"
          className="object-contain"
          alt="image"
        ></Image>
      </div>
    </>
  );
}
