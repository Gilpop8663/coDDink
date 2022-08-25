import { cls } from "@libs/client/utils";
import React, { ChangeEvent } from "react";

interface UploadProps {
  color:
    | "blueBtn"
    | "greenBtn"
    | "whiteDiv"
    | "grayBtn"
    | "greenDiv"
    | "blueDiv";
  label: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
  size?: "sm" | "base" | "xs" | "lg";
}

export default function NextButton({
  color,
  label,
  onChange,
  onClick,
  size = "base",
}: UploadProps) {
  return (
    <>
      {color === "whiteDiv" && (
        <div
          className={cls(
            `text-${size}`,
            " flex w-full cursor-pointer justify-center rounded-full  py-1 px-2 font-semibold text-gray-400 transition-colors hover:underline"
          )}
          onClick={onClick}
        >
          {label}
        </div>
      )}
      {color === "blueBtn" && (
        <button
          className={cls(
            `text-${size}`,
            "flex w-full cursor-pointer justify-center rounded-full bg-blue-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-blue-700"
          )}
          onClick={onClick}
        >
          {label}
        </button>
      )}
      {color === "blueDiv" && (
        <div
          className={cls(
            `text-${size}`,
            "flex w-full cursor-pointer justify-center rounded-full bg-blue-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-blue-700"
          )}
          onClick={onClick}
        >
          {label}
        </div>
      )}
      {color === "greenBtn" && (
        <button
          className={cls(
            `text-${size}`,
            "flex w-full cursor-pointer justify-center rounded-full bg-green-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-green-700"
          )}
          onClick={onClick}
        >
          {label}
        </button>
      )}

      {color === "greenDiv" && (
        <div
          className={cls(
            `text-${size}`,
            "flex w-full cursor-pointer justify-center rounded-full bg-green-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-green-700"
          )}
          onClick={onClick}
        >
          {label}
        </div>
      )}

      {color === "grayBtn" && (
        <button
          className={cls(
            `text-${size}`,
            "flex w-full cursor-pointer justify-center rounded-full border bg-white bg-white py-1 px-2 font-semibold text-black transition-colors hover:bg-gray-100"
          )}
          onClick={onClick}
        >
          {label}
        </button>
      )}
    </>
  );
}
