import UploadButton from "@components/uploadButton";
import { UploadProps } from "pages/portfolio/editor";
import React from "react";
import { UseFormRegister } from "react-hook-form";

interface EditFirstScreenProps {
  register: UseFormRegister<UploadProps>;
  onPreviewImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTextArea: (e: React.MouseEvent<HTMLDivElement>, idx?: number) => void;
  onAddCodeArea: (e: React.MouseEvent<HTMLDivElement>, idx?: number) => void;
}

export default function EditFirstScreen({
  register,
  onPreviewImage,
  onAddTextArea,
  onAddCodeArea,
}: EditFirstScreenProps) {
  return (
    <>
      <h3 className="relative bottom-32 text-2xl text-gray-400">
        프로젝트를 업로드 해보세요 :
      </h3>
      <div className="absolute flex space-x-5">
        <UploadButton
          register={register("images")}
          onChange={onPreviewImage}
          kind="image"
          label="이미지"
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
        </UploadButton>
        <UploadButton
          kind="text"
          label="텍스트"
          register={register("posts")}
          onClick={onAddTextArea}
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
        </UploadButton>
        <UploadButton
          kind="code"
          label="코드"
          register={register("code")}
          onClick={onAddCodeArea}
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
        </UploadButton>
      </div>
    </>
  );
}
