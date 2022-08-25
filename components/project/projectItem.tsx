import NextButton from "@components/upload/nextButton";
import UploadButton from "@components/uploadButton";
import { makeImageURL } from "@libs/client/utils";
import { idea_projectOwner } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { OwnerProps } from "pages";
import { useState } from "react";

interface ItemProps {
  title: string;
  likes: number;
  views: number;
  owner: OwnerProps[];
  thumbnail: string;
  onClick: () => void;
}

export default function ProjectItem({
  title,
  likes,
  views,
  owner,
  thumbnail,
  onClick,
}: ItemProps) {
  const [isContentTouch, setIsContentTouch] = useState(false);
  const [isOwnerTouch, setIsOwnerTouch] = useState(false);
  const onContentTouch = () => {
    setIsContentTouch((prev) => !prev);
  };
  const onOwnerTouch = () => {
    setIsOwnerTouch((prev) => !prev);
  };
  return (
    <div>
      <div
        onClick={onClick}
        onMouseOver={onContentTouch}
        onMouseOut={onContentTouch}
        className="relative flex cursor-pointer flex-col"
      >
        <div className="relative h-64 w-full rounded-md border hover:visible"></div>
        <Image
          src={makeImageURL(thumbnail, "public")}
          priority={true}
          alt="thumbnail"
          className="rounded-md object-cover"
          layout="fill"
        ></Image>
        {isContentTouch && (
          <div className="absolute bottom-0 flex h-16 w-full items-center rounded-md bg-gradient-to-t from-black/30 to-gray-600/0 px-4">
            <span className="relative top-2 font-semibold text-white hover:underline">
              {title}
            </span>
          </div>
        )}
      </div>
      <div
        onMouseOver={onOwnerTouch}
        onMouseOut={onOwnerTouch}
        className="mt-2 flex items-center justify-between
        pb-2
        "
      >
        <div className="mt-2 flex items-center text-sm font-semibold text-gray-700">
          {owner.length === 1 ? (
            <Link href={`/profile/${owner[0].userId}`}>
              <a className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-orange-500">
                  <Image
                    className="rounded-full"
                    src={makeImageURL(owner[0].user.avatar, "smAvatar")}
                    height={50}
                    width={50}
                    alt="avatar"
                  ></Image>
                </div>
                <span className="ml-1 hover:underline">{owner[0].name}</span>
              </a>
            </Link>
          ) : (
            <div className="relative">
              <div className="relative flex cursor-pointer items-center hover:underline">
                <span className="mr-1 text-xs">여러 소유자</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {isOwnerTouch && (
                <div className="absolute top-6 w-96 rounded-md border bg-white p-2 shadow-md transition-all">
                  {owner.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2"
                    >
                      <div className="flex items-center">
                        <Link href={`/profile/${item.userId}`}>
                          <a className="relative mr-2 h-10 w-10 cursor-pointer rounded-full bg-black">
                            <Image
                              src={makeImageURL(item.user.avatar, "smAvatar")}
                              alt="userAvater"
                              layout="fill"
                              className=" rounded-full object-cover transition-all hover:opacity-90"
                            ></Image>
                          </a>
                        </Link>
                        <div className="flex flex-col justify-center">
                          <Link href={`/profile/${item.userId}`}>
                            <a className="cursor-pointer hover:underline">
                              {item.name}
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
                      <div className="">
                        <NextButton
                          size="xs"
                          color="blueBtn"
                          label="팔로우"
                        ></NextButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="ml-1 text-xs font-semibold text-gray-500">
              {likes}
            </span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1 text-xs font-semibold text-gray-500">
              {views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
