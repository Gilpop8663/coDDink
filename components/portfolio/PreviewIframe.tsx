import { useState } from 'react';
import { cls } from '@libs/client/utils';
import MiniUploadMenu from './miniUploadMenu';

interface PreviewTextProps {
  idx: number;
  onPreviewImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    idx?: number
  ) => void;
  videoSrc: string;
  onAddTextArea: () => void;
  onAddCodeArea: () => void;
  onAddYoutubeArea: () => void;
  onClearClick: (idx: number) => void;
  [key: string]: any;
}

export default function PreviewIframe({
  idx,
  onAddTextArea,
  onPreviewImage,
  videoSrc,
  onAddCodeArea,
  onClearClick,
  onAddYoutubeArea,
}: PreviewTextProps) {
  const [isWrite, setIsWrite] = useState(true);

  const [isOver, setIsOver] = useState(false);

  const onOverArea = () => {
    setIsOver(true);
  };

  const onOutArea = () => {
    setIsOver(false);
  };

  const onWrite = () => {
    setIsWrite(true);
  };

  return (
    <div
      onMouseOut={onOutArea}
      onMouseOver={onOverArea}
      className={cls(
        !isWrite && videoSrc.length === 0 ? 'hidden h-0' : 'visible',
        'relative'
      )}
    >
      {(isWrite || videoSrc.length > 0) && (
        <MiniUploadMenu
          onAddCodeArea={onAddCodeArea}
          onAddTextArea={onAddTextArea}
          idx={idx}
          onPreviewImage={onPreviewImage}
          onAddYoutubeArea={onAddYoutubeArea}
        />
      )}
      {isOver && (
        <div
          onMouseOver={onWrite}
          className="absolute -top-4 flex items-center space-x-4 rounded-md bg-gray-700  px-4 py-2 text-white"
        >
          <div
            className="cursor-pointer"
            title="삭제하기"
            onClick={() => onClearClick(idx)}
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
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      )}
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={videoSrc}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
