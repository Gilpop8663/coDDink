import NextButton from "@components/upload/nextButton";
import { cls, makeImageURL } from "@libs/client/utils";
import { CoddinkFollow } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { OwnerProps } from "pages";
import React, { useState } from "react";

interface InfoProps {
  kind: "home" | "detail";
  owner: OwnerProps[];
  path: "home" | "gallery";
  onFollowClick: (id: number) => void;
  loginId: number | undefined;
  followingData: CoddinkFollow[] | undefined;
}

export default function OwnerInfo({
  kind,
  owner,
  path,
  onFollowClick,
  loginId,
  followingData,
}: InfoProps) {
  const [isOwnerTouch, setIsOwnerTouch] = useState(false);
  const onOwnerOut = () => {
    setIsOwnerTouch(false);
  };
  const onOwnerOver = () => {
    setIsOwnerTouch(true);
  };
  return (
    <div
      onMouseOver={onOwnerOver}
      onMouseOut={onOwnerOut}
      className={cls(
        kind === "detail" ? "text-white" : "text-gray-700",
        "mt-2 flex items-center pb-2 text-sm font-semibold"
      )}
    >
      {owner.length === 1 ? (
        <Link href={`/profile/${owner[0]?.userId}`}>
          <a className="flex items-center">
            {kind === "home" && (
              <div className="h-4 w-4 rounded-full bg-orange-500">
                <Image
                  className="rounded-full"
                  src={makeImageURL(owner[0]?.user?.avatar, "smAvatar")}
                  height={50}
                  width={50}
                  alt="avatar"
                ></Image>
              </div>
            )}
            <span
              className={cls(
                path === "gallery" || kind === "home"
                  ? "text-xs lg:text-gray-700"
                  : "text-sm lg:text-white",
                "ml-1 text-black hover:underline"
              )}
            >
              {owner[0].user.name}
            </span>
          </a>
        </Link>
      ) : (
        <div className="relative" onMouseOver={onOwnerOver}>
          <div className="relative flex cursor-pointer items-center hover:underline">
            <span
              className={cls(
                path === "gallery" || kind === "home"
                  ? "text-xs text-gray-700"
                  : "text-sm text-white",
                "mr-1 text-black hover:underline"
              )}
            >
              여러 소유자
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={cls(
                path === "gallery" || kind === "home"
                  ? "text-xs text-gray-700"
                  : "text-white",
                "h-4 w-4 text-black hover:underline"
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
          {isOwnerTouch && (
            <div className="absolute top-6 z-10 w-96 rounded-md border bg-white p-2 text-gray-700 shadow-md transition-all">
              {owner.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2"
                >
                  <div className="flex items-center">
                    <Link href={`/profile/${item.userId}`}>
                      <a className="relative mr-2 h-10 w-10 cursor-pointer rounded-full bg-black">
                        <Image
                          src={makeImageURL(item?.user?.avatar, "smAvatar")}
                          alt="userAvater"
                          layout="fill"
                          className=" rounded-full object-cover transition-all hover:opacity-90"
                        ></Image>
                      </a>
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link href={`/profile/${item.userId}`}>
                        <a className="cursor-pointer hover:underline">
                          {item.user?.name}
                        </a>
                      </Link>
                      {(item.user.city !== null ||
                        item.user.country !== null) && (
                        <div className="font-base flex cursor-pointer items-center text-xs text-gray-400 transition-colors hover:text-gray-800 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="mr-1 h-4 w-4 "
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            />
                          </svg>

                          <span>
                            {item.user.city && `${item.user.city},`}
                            {item.user.country}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {Boolean(loginId) && loginId !== item.userId && (
                    <div className="">
                      {followingData?.find(
                        (ele) => ele.followerId === item.userId
                      ) ? (
                        <NextButton
                          onClick={() => onFollowClick(item.userId)}
                          size="xs"
                          color="followDelBtn"
                          label={"팔로잉"}
                        ></NextButton>
                      ) : (
                        <NextButton
                          onClick={() => onFollowClick(item.userId)}
                          size="xs"
                          color="blueBtn"
                          label={"팔로우"}
                        ></NextButton>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
