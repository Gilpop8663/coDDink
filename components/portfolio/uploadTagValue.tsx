import React from "react";

interface UploadTagValue {
  value: string;
  onClick: React.MouseEventHandler<SVGSVGElement>;
}

export default function UploadTagValue({ value, onClick }: UploadTagValue) {
  return (
    <div className="m-2 flex items-center rounded-sm bg-gray-900 p-2 font-semibold text-white ">
      <span className="mr-2">{value}</span>
      <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 cursor-pointer text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
}
