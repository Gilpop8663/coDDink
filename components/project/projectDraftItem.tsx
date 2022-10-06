import DeleteModal from "@components/profile/deleteModal";
import NextButton from "@components/upload/nextButton";
import UploadButton from "@components/uploadButton";
import { makeImageURL } from "@libs/client/utils";
import { CoddinkFollow, CoddinkProjectOwner } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { OwnerProps } from "pages";
import { useState } from "react";
import OwnerInfo from "./ownerInfo";

interface ItemProps {
  title: string;
  likes: number;
  views: number;
  owner: OwnerProps[];
  thumbnail: string;
  onClick: () => void;
  onFollowClick: (id: number) => void;
  loginId: number | undefined;
  followingData: CoddinkFollow[] | undefined;
  onDeleteModalClick: () => void;
}

export default function ProjectDraftItem({
  title,
  likes,
  views,
  owner,
  thumbnail,
  onClick,
  onFollowClick,
  loginId,
  followingData,
  onDeleteModalClick,
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
    <div className="w-80 sm:w-full">
      <div
        onMouseOver={onContentTouch}
        onMouseOut={onContentTouch}
        className="relative flex cursor-pointer flex-col"
      >
        <div className="relative flex h-64 max-h-80  w-auto items-center justify-center rounded-md border bg-gray-100 hover:visible">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-12 w-12 text-gray-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
        {thumbnail !== "" && (
          <Image
            src={makeImageURL(thumbnail, "public")}
            priority={true}
            alt="thumbnail"
            className="rounded-md object-cover"
            layout="fill"
          ></Image>
        )}
        {isContentTouch && (
          <div className="absolute bottom-0 flex h-full w-full flex-col items-center justify-center rounded-md bg-black/40  px-4 ">
            <div className="flex flex-col space-y-2">
              <NextButton
                onClick={onClick}
                color="blueDiv"
                label="프로젝트 편집"
              ></NextButton>
              <NextButton
                color="grayBtn"
                onClick={onDeleteModalClick}
                label="프로젝트 삭제"
              ></NextButton>
            </div>
            <span className="absolute bottom-5 font-semibold text-white hover:underline">
              {title}
            </span>
          </div>
        )}
      </div>
      <div
        // onMouseOver={onOwnerTouch}
        // onMouseOut={onOwnerTouch}
        className="mt-2 flex items-center justify-between pb-2"
      >
        <OwnerInfo
          followingData={followingData}
          onFollowClick={onFollowClick}
          path="home"
          kind="home"
          owner={owner}
          loginId={loginId}
        ></OwnerInfo>

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
