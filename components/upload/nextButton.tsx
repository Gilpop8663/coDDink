import React, { ChangeEvent } from "react";

interface UploadProps {
  color: "blue" | "green" | "white" | "gray";
  label: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export default function NextButton({
  color,
  label,
  onChange,
  onClick,
}: UploadProps) {
  return (
    <>
      {color === "white" && (
        <div
          className="flex w-full cursor-pointer justify-center rounded-full  py-1 px-2 font-semibold text-gray-400 transition-colors hover:underline"
          onClick={onClick}
        >
          {label}
        </div>
      )}
      {color === "blue" && (
        <div
          className="flex w-full cursor-pointer justify-center rounded-full bg-blue-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-blue-700"
          onClick={onClick}
        >
          {label}
        </div>
      )}
      {color === "green" && (
        <button
          className="flex w-full cursor-pointer justify-center rounded-full bg-green-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-green-700"
          onClick={onClick}
        >
          {label}
        </button>
      )}
      {color === "gray" && (
        <button
          className="flex w-full cursor-pointer justify-center rounded-full border bg-white py-1 px-2 font-semibold text-black transition-colors hover:bg-gray-100"
          onClick={onClick}
        >
          {label}
        </button>
      )}
    </>
  );
}
