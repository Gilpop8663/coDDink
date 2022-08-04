import React, { ChangeEvent } from "react";

interface UploadProps {
  kind: "text" | "image" | "code";
  label: string;
  children: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadButton({
  kind,
  label,
  children,
  onChange,
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
            id="attatchment"
            className="hidden"
            type="file"
            accept="image/*"
            onChange={onChange}
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
