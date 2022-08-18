import Image from "next/image";
import React, { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface UploadProps {
  kind: "text" | "image" | "code" | "profile";
  label?: string;
  children?: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegisterReturn;
  previewImage?: string;
}

export default function UploadButton({
  kind,
  label,
  children,
  onChange,
  register,
  previewImage,
}: UploadProps) {
  return (
    <div className="flex flex-col items-center">
      {kind === "image" && (
        <label
          htmlFor="attatchment"
          className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-200 hover:bg-blue-600 hover:text-white"
        >
          {children}
          <input
            multiple
            id="attatchment"
            className="hidden"
            type="file"
            accept="image/*"
            {...register}
          />
        </label>
      )}
      {kind === "profile" && (
        <label htmlFor="picture" className="mt-4 flex flex-col border-r pr-8">
          {previewImage ? (
            <div className="relative h-24 w-24">
              <Image
                src={previewImage}
                layout="fill"
                alt="previewAvatar"
                className="h-24 w-24 cursor-pointer rounded-full bg-orange-200"
              />
            </div>
          ) : (
            <div className="h-24 w-24 cursor-pointer rounded-full bg-orange-200"></div>
          )}
          <div className="mt-2 flex cursor-pointer items-center text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-sm">업로드</div>
          </div>
          {children}
          <input
            {...register}
            id="picture"
            className="hidden"
            type="file"
            accept="image/*"
          />
        </label>
      )}
      {kind === "text" && (
        <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-200 hover:bg-blue-600 hover:text-white">
          {children}
        </div>
      )}
      {kind === "code" && (
        <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-200 hover:bg-blue-600 hover:text-white">
          {children}
        </div>
      )}
      <span className="mt-4 text-sm font-semibold">{label}</span>
    </div>
  );
}
