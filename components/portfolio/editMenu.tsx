import React from 'react'

export default function EditMenu() {
  return (
    <div className="relative h-5/6 w-full border-blue-600 hover:border">
    <div
      className={cls(
        isEditOver ? "ring-1 ring-blue-600 " : "",
        "absolute -left-2 -top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md"
      )}
      onClick={onEditHover}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className=" h-5 w-5 "
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </div>
    {isEditOver && (
      <div className="absolute -left-2 top-6 z-10 flex flex-col space-y-1 rounded-md border bg-white py-2 text-sm shadow-md">
        {/* <span className="px-3 py-1 hover:bg-blue-600 hover:text-white">
        프로젝트 순서 변경
        </span>
        <span className="px-3 py-1 hover:bg-blue-600 hover:text-white">
        Image 바꾸기
      </span> */}
        <span
          onClick={() => onClearClick(idx)}
          className="cursor-pointer px-3 py-1 hover:bg-blue-600 hover:text-white"
        >
          Image 삭제
        </span>
      </div>
    )}
  )
}
