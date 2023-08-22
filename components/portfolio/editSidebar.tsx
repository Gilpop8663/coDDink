import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { ContentProps, UploadProps } from 'pages/portfolio/editor';
import Button from '@components/common/Button';
import SubUploadButton from '@components/subUploadButton';

interface EditSidebarProps {
  onSetting: () => void;
  content: ContentProps[];
  register: UseFormRegister<UploadProps>;
  onPreviewImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTextArea: () => void;
  onAddCodeArea: () => void;
  onDraftClick: () => void;
  onPreviewClick: () => void;
  isDraft: boolean;
}

export default function EditSidebar({
  onSetting,
  register,
  content,
  onPreviewImage,
  onAddTextArea,
  onAddCodeArea,
  onDraftClick,
  onPreviewClick,
  isDraft,
}: EditSidebarProps) {
  return (
    <div className="grid-cols-2 2xl:grid-cols-1">
      <div className="max-w-96 fixed right-8 w-72">
        <div className="flex w-full flex-col border shadow-md">
          <div className="flex h-8 items-center bg-gray-100 pl-2 text-xs font-semibold text-gray-500">
            콘텐츠 추가
          </div>
          <div className="grid grid-cols-3 place-content-center gap-[1.5px]">
            <SubUploadButton
              label="이미지"
              kind="image"
              onChange={onPreviewImage}
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </SubUploadButton>
            <SubUploadButton label="텍스트" onClick={onAddTextArea}>
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
            </SubUploadButton>
            <SubUploadButton label="코드" onClick={onAddCodeArea}>
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
            </SubUploadButton>
          </div>
          <div className="flex h-8 items-center bg-gray-100 pl-2 text-xs font-semibold text-gray-500">
            프로젝트 편집
          </div>
          <SubUploadButton label="설정" onClick={onSetting}>
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </SubUploadButton>
        </div>
        <div className="mt-20 space-y-4 border bg-white py-7 px-4 shadow-md">
          {content.length && !isDraft ? (
            <>
              <Button
                color="green"
                text="계속"
                type="button"
                onClick={onSetting}
              />
              <Button
                text="초안으로 저장"
                color="blue"
                type="button"
                onClick={onDraftClick}
              />
              <div
                className="mt-4 flex justify-center text-gray-400"
                onClick={onPreviewClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="cursor-pointer text-sm hover:underline">
                  미리보기 확인
                </span>
              </div>
            </>
          ) : (
            <>
              <Button type="button" color="disabled" text="계속" />
              <Button
                type="button"
                text={isDraft ? '로딩중' : '초안으로 저장'}
                color="disabled"
              />
              <div className="mt-4 flex justify-center text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="select-none text-sm text-gray-200">
                  미리보기 확인
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
