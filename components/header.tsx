import useMutation from "@libs/client/useMutation";
import { cls, makeImageURL } from "@libs/client/utils";
import { idea_user } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Button from "./button";

interface HeaderProps {
  isLogin: boolean;
  profile?: idea_user;
  kind?: "normal" | "profile";
  userId: number | undefined;
}

interface LogoutResult {
  ok: boolean;
}

export default function Header({
  isLogin,
  profile,
  kind,
  userId,
}: HeaderProps) {
  const router = useRouter();
  const path = router.pathname;
  const [isWorkOn, setIsWorkOn] = useState(false);
  const [isProfileOn, setIsProfileOn] = useState(false);
  const [logout, { loading, error }] = useMutation("/api/users/logout");

  const onLogoutClick = () => {
    logout({});
    router.reload();
  };

  const onMouseOver = () => {
    setIsWorkOn(true);
  };
  const onMouseLeave = () => {
    setIsWorkOn(false);
  };

  const onProfileOver = () => {
    setIsProfileOn(true);
  };
  const onProfileLeave = () => {
    setIsProfileOn(false);
  };

  return (
    <div
      className={cls(
        "fixed z-20 flex h-16 w-full items-center justify-between border-b px-6",
        kind === "profile" ? "bg-black/0 text-white" : "bg-white text-black"
      )}
    >
      <div className="item-center flex h-16 space-x-5 py-5">
        <Link href="/">
          <a className="cursor-pointer text-lg font-bold">로고</a>
        </Link>
        {isLogin && (
          <Link href="/">
            <a
              className={cls(
                path === "/" ? "border-b-2 border-gray-800" : "",
                "h-full cursor-pointer pb-10 text-base font-semibold transition-all hover:border-b-2 hover:border-gray-800"
              )}
            >
              당신을 위한
            </a>
          </Link>
        )}

        <Link href="/gallery">
          <a
            className={cls(
              path === "/galleries" ? "border-b-2 border-gray-800" : "",
              "h-full cursor-pointer pb-10 text-base font-semibold transition-all hover:border-b-2 hover:border-gray-800"
            )}
          >
            탐색
          </a>
        </Link>
        <Link href="/live">
          <a
            className={cls(
              path === "/live" ? "border-b-2 border-gray-800" : "",
              "h-full cursor-pointer pb-10 text-base font-semibold transition-all hover:border-b-2 hover:border-gray-800"
            )}
          >
            라이브스트림
          </a>
        </Link>
        <Link href="/joblist">
          <a
            className={cls(
              path === "/joblist" ? "border-b-2 border-gray-800" : "",
              "h-full cursor-pointer pb-10 text-base font-semibold transition-all hover:border-b-2 hover:border-gray-800"
            )}
          >
            직업
          </a>
        </Link>
      </div>
      <div className="flex space-x-2">
        {isLogin === false ? (
          <>
            <Link href="/user/login">
              <a className="cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-100">
                로그인
              </a>
            </Link>
            <Link href="/user/create">
              <a className="cursor-pointer rounded-full border bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                등록
              </a>
            </Link>
          </>
        ) : (
          <div className="flex items-center pr-48">
            <div
              className="relative mr-48 flex justify-center rounded-full bg-white text-black"
              onMouseOver={onMouseOver}
              onMouseOut={onMouseLeave}
            >
              <Button kind="white" value="내 작업 공유"></Button>
              {isWorkOn && (
                <div className="absolute top-8  w-[450px] rounded-md border bg-white p-5 shadow-md ">
                  <Link href="/portfolio/editor">
                    <a className="mb-3 flex w-auto  cursor-pointer items-center justify-between rounded-md border border-blue-200 bg-[#F5F8FF] p-2 text-blue-600 transition-all hover:bg-[#DEE8FF]">
                      <span className="flex h-10 items-center justify-center ">
                        <div className="border-r border-r-blue-200 px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </div>

                        <div className="ml-4 flex flex-col">
                          <div className="text-sm font-semibold">프로젝트</div>
                          <div className="text-xs">프로젝트 업로드</div>
                        </div>
                      </span>
                      <div className="pr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </a>
                  </Link>
                  <Link href="/live/upload">
                    <div className="flex w-auto cursor-pointer  items-center justify-between rounded-md border border-blue-200 bg-[#F5F8FF] p-2 text-blue-600 transition-all hover:bg-[#DEE8FF]">
                      <span className="flex h-10 items-center justify-center ">
                        <div className="border-r border-r-blue-200 px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>

                        <div className="ml-4 flex flex-col">
                          <div className="text-sm font-semibold">
                            라이브스트림
                          </div>
                          <div className="text-xs">
                            데스크탑에서 라이브 방송
                          </div>
                        </div>
                      </span>
                      <div className="pr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            {isProfileOn && (
              <div className="absolute top-0 left-0 h-screen w-screen bg-black opacity-10"></div>
            )}
            <div
              className="relative m-auto flex h-7 w-7 justify-center"
              onMouseOver={onProfileOver}
              onMouseOut={onProfileLeave}
            >
              {profile && (
                <Image
                  className="rounded-full"
                  src={makeImageURL(profile?.avatar!, "smAvatar")}
                  width={50}
                  height={50}
                  alt="avatar"
                ></Image>
              )}
              {isProfileOn && (
                <div className="absolute top-6  flex w-[350px] flex-col items-center rounded-md border bg-white p-5 text-black shadow-md">
                  <Link href={`/profile/${userId}`}>
                    <a className="z-10 flex h-24 w-24 cursor-pointer rounded-full bg-black ring-2 ring-gray-300">
                      <Image
                        className="rounded-full hover:opacity-90"
                        src={makeImageURL(profile?.avatar!, "bigAvatar")}
                        width={180}
                        height={180}
                        alt="avatar"
                      ></Image>
                    </a>
                  </Link>
                  <div className="mt-4 text-lg font-semibold">
                    {profile?.name}
                  </div>
                  <div className="mt-1 text-sm text-gray-400">
                    {profile?.email}
                  </div>
                  <div className="my-4 h-[0.5px] w-[350px] bg-gray-200"></div>

                  <Link href={`/profile/${userId}`}>
                    <a className="flex w-full cursor-pointer justify-center rounded-md py-2 text-sm font-semibold transition-colors hover:bg-gray-100">
                      프로필 관리
                    </a>
                  </Link>
                  <div
                    onClick={onLogoutClick}
                    className="flex w-full cursor-pointer justify-center rounded-md py-2 text-sm font-semibold transition-colors hover:bg-gray-100"
                  >
                    로그아웃
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div>로고</div>
      </div>
    </div>
  );
}
