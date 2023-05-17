import React, { useEffect } from 'react';
import NextButton from '@components/upload/NextButton';

interface DeleteModalProps {
  title: string;
  description: string;
  onDeleteModalClick: () => void;
  onProjectDeleteClick: () => void;
}

export default function DeleteModal({
  title,
  description,
  onDeleteModalClick,
  onProjectDeleteClick,
}: DeleteModalProps) {
  useEffect(() => {
    document.body.style.cssText = `
          position: fixed; 
          top: -${window.scrollY}px;
          overflow-y: scroll;
          width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);

  return (
    <div
      onClick={onDeleteModalClick}
      className="fixed  top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/80"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-48 w-[600px] justify-between rounded-md bg-white"
      >
        <div className="flex h-full flex-col  justify-between p-7">
          <div className="flex flex-col">
            <span className="text-xl font-bold">{title}</span>
            <span className="mt-2 text-sm font-thin">{description}</span>
          </div>
          <div className="flex w-32">
            <NextButton
              onClick={onProjectDeleteClick}
              size="sm"
              color="blueDiv"
              label="삭제"
            ></NextButton>
            <NextButton
              onClick={onDeleteModalClick}
              size="sm"
              color="whiteDiv"
              label="취소"
            ></NextButton>
          </div>
        </div>
        <div className="cursor-pointer p-3" onClick={onDeleteModalClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-4 w-4 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
