import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CoddinkUser } from '@prisma/client';
import useSWR from 'swr';
import useMutation from '@libs/client/useMutation';
import { cls, makeImageURL } from '@libs/client/utils';
import Button from '@components/common/Button';
import SearchBar from '@components/common/SearchBar';

interface HeaderProps {
  isLogin: boolean;
  profile?: CoddinkUser;
  kind?: 'normal' | 'profile';
  userId: number | undefined;
  isTop?: boolean;
}

interface LogoutResult {
  ok: boolean;
}

export default function Header({
  isLogin,
  profile,
  kind,
  userId,
  isTop,
}: HeaderProps) {
  const router = useRouter();
  const path = router.pathname;
  const [isWorkOn, setIsWorkOn] = useState(false);
  const [isProfileOn, setIsProfileOn] = useState(false);
  const [logout, { loading, error, data }] = useMutation('/api/users/logout');
  const { data: searchData, mutate } = useSWR('/api/projects/search');
  const [isShowMenu, setIsShowModal] = useState(false);
  const [isShowInfo, setIsShowInfo] = useState(false);
  const [isShowProfile, setIsShowProfile] = useState(false);

  const onProfileClick = () => {
    setIsShowProfile((prev) => !prev);
  };

  const onInfoClick = () => {
    setIsShowInfo((prev) => !prev);
  };

  const onMenuClick = () => {
    setIsShowModal((prev) => !prev);
  };
  const onLogoutClick = () => {
    logout({});
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

  useEffect(() => {
    if (data && data.ok) {
      router.reload();
    }
  }, [data]);

  return (
    <div
      className={cls(
        'fixed z-50 flex h-16 w-full items-center justify-between border-b px-6 transition-all lg:z-20 ',
        isTop && kind === 'profile'
          ? 'bg-black/0 text-white'
          : 'bg-white text-black'
      )}
    >
      <div className="item-center hidden  h-16 space-x-5 py-5 lg:flex">
        <Link href="/">
          {/* <a className="relative top-[1px] flex h-[20px] w-[82.58px] cursor-pointer items-center text-lg font-bold">
            <Image src={LOGO} layout="fill" alt="logo"></Image>
          </a> */}
          <span className="relative bottom-[3px] cursor-pointer text-xl font-semibold transition-colors">
            coDDink
          </span>
        </Link>
        <Link href="/">
          <a
            className={cls(
              path === '/' ? 'border-b-2 border-gray-800' : '',
              'h-full cursor-pointer pb-10 text-base font-semibold transition-all hover:border-b-2 hover:border-gray-800'
            )}
          >
            {isLogin ? '당신을 위한' : '탐색'}
          </a>
        </Link>

        {/* <Link href="/gallery">
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
        </Link> */}
      </div>
      <div className="flex items-center lg:hidden">
        <svg
          onClick={onMenuClick}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-5 w-5 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <Link href="/">
          <a className="ml-3 cursor-pointer text-lg font-bold">CO</a>
        </Link>
      </div>
      {isShowMenu && (
        <>
          <div className="fixed left-0 top-0 z-20 flex h-screen w-[290px] bg-white px-4 py-4 text-black lg:hidden">
            <div className="flex w-full flex-col items-center">
              <div className="flex w-full items-center justify-between">
                <svg
                  onClick={onMenuClick}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6 cursor-pointer"
                >
                  <title>Close</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {isLogin ? (
                  <Button
                    color="white"
                    text="내 작업 공유"
                    onClick={onInfoClick}
                  />
                ) : (
                  <Link href="/user/login">
                    <a
                      className={
                        'cursor-pointer rounded-full border bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100'
                      }
                    >
                      로그인
                    </a>
                  </Link>
                )}
                {isShowInfo && (
                  <div
                    className="absolute  top-14 right-2 flex flex-col rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                    role="alert"
                  >
                    <strong className="mb-2 font-bold">
                      화면이 너무 작습니다!
                    </strong>
                    <span className="block sm:inline">
                      더 큰 화면에서 진행해주세요.
                    </span>
                    <span
                      className="absolute top-0 bottom-0 right-0 px-4 py-3"
                      onClick={onInfoClick}
                    >
                      <svg
                        className="h-6 w-6 fill-current text-red-500"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-8 flex w-full justify-between">
                <Link href="/">
                  <a
                    className={cls(
                      path === '/' ? ' border-l-4 border-gray-800 px-4' : '',
                      'h-full cursor-pointer text-base font-semibold transition-all '
                    )}
                  >
                    {isLogin ? '당신을 위한' : '탐색'}
                  </a>
                </Link>
              </div>
              <div className="mt-8 flex w-full justify-between">
                {!isLogin && (
                  <Link href="/user/create">
                    <a className="cursor-pointer rounded-full border bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                      등록
                    </a>
                  </Link>
                )}
              </div>
              <div
                className="mt-8 flex w-full cursor-pointer justify-between"
                onClick={onProfileClick}
              >
                {profile?.avatar && (
                  <div className="flex items-center">
                    <div className="relative h-9 w-9 rounded-full">
                      <Image
                        className="rounded-full"
                        src={makeImageURL(profile.avatar, 'smAvatar')}
                        layout="fill"
                        alt="avatar"
                        priority={true}
                      ></Image>
                    </div>
                    <span className="ml-2 cursor-pointer text-base font-semibold transition-all ">
                      나
                    </span>

                    {isShowProfile ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="ml-2 h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 15.75l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="ml-2 h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {isShowProfile && (
                <div className="mt-3 flex w-full flex-col justify-between space-y-4 pl-12">
                  <Link href={`/profile/${userId}`}>
                    <a className="cursor-pointer text-sm hover:underline">
                      coDDink 프로필
                    </a>
                  </Link>
                  <span
                    onClick={onLogoutClick}
                    className="cursor-pointer text-sm hover:underline"
                  >
                    로그아웃
                  </span>
                </div>
              )}
            </div>
          </div>
          <div
            className="fixed left-0 top-0 z-10 h-screen w-screen bg-black/25 lg:hidden"
            onClick={onMenuClick}
          ></div>
        </>
      )}

      <SearchBar isTop={isTop} />

      <div className="hidden space-x-2 lg:flex">
        {isLogin === false ? (
          <>
            <Link href="/user/login">
              <a
                className={
                  'cursor-pointer rounded-full border bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100'
                }
              >
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
          <div className="flex items-center lg:pr-24 2xl:pr-48">
            {isWorkOn && (
              <div className="absolute left-0 top-0 h-screen w-screen bg-black/10"></div>
            )}
            <div
              className="relative mr-12 flex justify-center rounded-full bg-white text-black"
              onMouseOver={onMouseOver}
              onMouseOut={onMouseLeave}
            >
              <Button color="white" text="내 작업 공유"></Button>
              {isWorkOn && (
                <div className="absolute h-24 w-96">
                  <div className="absolute top-12  w-[350px] rounded-md border bg-white p-5 shadow-md ">
                    <div className="absolute right-[40%] top-[-1%] h-0 w-0 translate-y-[-50%] border-t-0 border-r-[12px] border-l-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-white "></div>
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
                            <div className="text-sm font-semibold">
                              프로젝트
                            </div>
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
                    {/* <Link href="/live/upload">
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
                  </Link> */}
                  </div>
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
              {profile?.avatar && (
                <div className="relative h-7 w-7 rounded-full">
                  <Image
                    className="rounded-full"
                    src={makeImageURL(profile.avatar, 'smAvatar')}
                    layout="fill"
                    alt="avatar"
                    priority={true}
                  ></Image>
                </div>
              )}
              {isProfileOn && profile?.avatar && (
                <div className="absolute -right-16 h-80 w-96">
                  <div className=" absolute  top-10 flex w-[350px] flex-col items-center rounded-md bg-white p-5 text-black shadow-md ">
                    <div className="absolute right-[10%] top-[-1%] h-0 w-0 translate-y-[-50%] border-t-0 border-r-[12px] border-l-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-white "></div>
                    <Link href={`/profile/${userId}`}>
                      <a className="z-10 flex h-24 w-24 cursor-pointer rounded-full bg-black ring-2 ring-gray-300">
                        <Image
                          className="rounded-full hover:opacity-90"
                          src={makeImageURL(profile?.avatar!, 'bigAvatar')}
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
