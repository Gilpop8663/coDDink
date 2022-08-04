import React from "react";

interface ButtonProps {
  kind: "white" | "blue";
  value: string;
  onClick?: () => void;
  onFocus?: () => void;
  onMouseLeave?: () => void;
  onMouseEnter?: () => void;
  onMouseOver?: () => void;
}

export default function Button({
  kind,
  value,
  onClick,
  onFocus,
  onMouseLeave,
  onMouseEnter,
  onMouseOver,
}: ButtonProps) {
  return (
    <>
      {kind === "white" && (
        <button
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          onMouseEnter={onMouseEnter}
          onFocus={onFocus}
          className="cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-100"
        >
          {value}
        </button>
      )}
      {kind == "blue" && (
        <button
          onClick={onClick}
          onMouseLeave={onMouseLeave}
          onMouseEnter={onMouseEnter}
          onFocus={onFocus}
          className="mt-4 flex cursor-pointer items-center justify-center self-end rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          {value}
        </button>
      )}
    </>
  );
}
