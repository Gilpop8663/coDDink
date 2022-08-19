import React, { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface UploadProps {
  kind?: "default" | "image" | "miniImage";
  label?: string;
  children?: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>, idx?: number) => void;
  onClick?: () => void;
  idx?: number;
  register?: UseFormRegisterReturn;
}

export default function SubUploadButton({
  kind = "default",
  label,
  children,
  onChange,
  onClick,
  register,
  idx,
}: UploadProps) {
  return (
    <>
      {kind === "default" && (
        <div
          className="col-span-1 flex cursor-pointer flex-col items-center justify-center bg-white py-4 transition-colors hover:bg-gray-100"
          onClick={onClick}
        >
          {children}
          <span className="mt-2 text-xs">{label}</span>
        </div>
      )}
      {kind === "image" && (
        <label
          htmlFor="attatchment"
          className="col-span-1 flex cursor-pointer flex-col items-center justify-center bg-white py-4 transition-colors hover:bg-gray-100"
        >
          {children}
          <span className="mt-2 text-xs">{label}</span>
          <input
            onChange={onChange}
            multiple
            id="attatchment"
            className="hidden"
            type="file"
            accept="image/*"
            {...register}
          />
        </label>
      )}
      {kind === "miniImage" && (
        <label
          htmlFor="attatchment"
          className="cursor-pointer rounded-md p-1 hover:bg-gray-400"
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
          <input
            multiple
            onChange={onChange}
            id="attatchment"
            className="hidden"
            type="file"
            accept="image/*"
            // {...register}
          />
        </label>
      )}
    </>
  );
}
