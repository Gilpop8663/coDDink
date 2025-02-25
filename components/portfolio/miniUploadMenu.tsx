import React, { useState } from 'react';
import SubUploadButton from '@components/subUploadButton';

interface MiniUploadMenuProps {
  idx: number;
  onPreviewImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    idx?: number
  ) => void;
  onAddTextArea: () => void;
  onAddCodeArea: () => void;
  onAddYoutubeArea: () => void;
}

export default function MiniUploadMenu({
  idx,
  onPreviewImage,
  onAddTextArea,
  onAddCodeArea,
  onAddYoutubeArea,
}: MiniUploadMenuProps) {
  const [isCreateOver, setIsCreateOver] = useState(false);
  const onCreateHover = () => {
    setIsCreateOver((prev) => !prev);
  };
  return (
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
          <div
            onClick={onAddYoutubeArea}
            className="cursor-pointer rounded-md p-1 hover:bg-gray-400"
            title="유튜브"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <div
            onClick={onAddTextArea}
            className="cursor-pointer rounded-md p-1 hover:bg-gray-400"
            title="텍스트"
          >
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
          <div
            onClick={onAddCodeArea}
            className="cursor-pointer rounded-md p-1 hover:bg-gray-400"
            title="코드"
          >
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
  );
}
