import React from "react";

interface ButtonProps {
  value: string;
  onClick?: () => void;
}

export default function Button({ value, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mt-4 flex cursor-pointer items-center justify-center self-end rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
    >
      {value}
    </button>
  );
}
