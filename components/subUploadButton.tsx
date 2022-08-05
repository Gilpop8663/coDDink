import React, { ChangeEvent } from "react";

interface UploadProps {
  label: string;
  children: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
}

export default function SubUploadButton({
  label,
  children,
  onChange,
  onClick,
}: UploadProps) {
  return (
    <div
      className="col-span-1 flex cursor-pointer flex-col items-center justify-center bg-white py-4 transition-colors hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
      <span className="mt-2 text-xs">{label}</span>
    </div>
  );
}
