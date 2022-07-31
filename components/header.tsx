import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="fixed flex h-16 w-full items-center justify-between border-b px-6">
      <div className="item-center flex h-16 space-x-5 py-5">
        <Link href="/">
          <a className="cursor-pointer text-lg font-bold">로고</a>
        </Link>
        <div className="h-full cursor-pointer pb-10 text-base font-semibold transition-all hover:border-b-2 hover:border-gray-800">
          탐색
        </div>
        <div className="h-full cursor-pointer pb-10 text-base font-semibold transition-all hover:border-b-2 hover:border-gray-800">
          라이브스트림
        </div>
        <div className="h-full cursor-pointer pb-10 text-base font-semibold transition-all hover:border-b-2 hover:border-gray-800">
          직업
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-100">
          로그인
        </div>
        <Link href="/user/create">
          <a className="cursor-pointer rounded-full border bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            등록
          </a>
        </Link>
        <div>로고</div>
      </div>
    </div>
  );
}
