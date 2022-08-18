import React, { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface UploadProps {
  kind?: "default" | "image";
  label: string;
  children: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  register?: UseFormRegisterReturn;
}

export default function SubUploadButton({
  kind = "default",
  label,
  children,
  onChange,
  onClick,
  register,
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
    </>
  );
}
