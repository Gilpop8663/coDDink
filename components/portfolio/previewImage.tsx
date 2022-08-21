import SubUploadButton from "@components/subUploadButton";
import UploadButton from "@components/uploadButton";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import React, { useState } from "react";
import EditMenu from "./editMenu";

interface PreviewImageProps {
  src: string;
  idx: number;
  onClearClick: (idx: number) => void;
  onPreviewImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    idx?: number
  ) => void;
}

export default function PreviewImage({
  src,
  idx,
  onClearClick,
  onPreviewImage,
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
    <div className="h-screen">
      <div
        onMouseOver={onCreateHover}
        onMouseOut={onCreateHover}
        className=" flex h-8 items-center justify-center  border border-dashed border-white transition-all hover:border-blue-600"
      >
        {isCreateOver && (
          <div className="z-10 flex items-center space-x-3 rounded-md bg-gray-900 py-2 px-8 text-white">
            <span>미디어 삽입:</span>
            <SubUploadButton
              idx={idx}
              kind="miniImage"
              onChange={(e) => onPreviewImage(e, idx)}
            ></SubUploadButton>
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
        <EditMenu
          kind="Image"
          isEditOver={isEditOver}
          onEditHover={onEditHover}
          idx={idx}
          onClearClick={onClearClick}
        />
        <Image
          src={src}
          layout="fill"
          className="object-contain"
          alt="image"
        ></Image>
      </div>
    </div>
  );
}
