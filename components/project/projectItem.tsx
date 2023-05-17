import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CoddinkFollow } from '@prisma/client';
import { OwnerProps } from 'pages';
import { cls, makeImageURL } from '@libs/client/utils';
import OwnerInfo from './ownerInfo';

interface ItemProps {
  projectId: number;
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
  visible: boolean;
}

export default function ProjectItem({
  projectId,
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
  visible,
}: ItemProps) {
  const [isContentTouch, setIsContentTouch] = useState(false);
  const [isOwnerTouch, setIsOwnerTouch] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const onContentTouch = (kind: boolean) => {
    setIsContentTouch(kind);
  };
  const onOwnerTouch = () => {
    setIsOwnerTouch((prev) => !prev);
  };

  const onSettingTouch = (kind: boolean) => {
    setIsSetting(kind);
  };
  return (
    <div className="w-80 sm:w-full">
      <div
        onClick={onClick}
        onMouseOver={() => onContentTouch(true)}
        onMouseOut={() => onContentTouch(false)}
        className="relative flex cursor-pointer flex-col"
      >
        <div className="relative  h-64 max-h-80 w-auto  rounded-md  border hover:visible"></div>

        <Image
          src={makeImageURL(thumbnail, 'public')}
          priority={true}
          alt="thumbnail"
          className="rounded-md object-cover"
          layout="fill"
        ></Image>

        {isContentTouch && (
          <>
            {owner[0]?.userId === loginId && (
              <div onClick={(e) => e.stopPropagation()}>
                <div
                  onMouseOver={() => onSettingTouch(true)}
                  onMouseOut={() => onSettingTouch(false)}
                  className={cls(
                    isSetting ? 'bg-black/50' : 'bg-black/30',
                    'absolute left-3 top-3 flex items-center rounded-full p-2 text-white'
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="ml-2 h-3 w-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
                {isSetting && (
                  <div
                    onMouseOver={() => onSettingTouch(true)}
                    onMouseOut={() => onSettingTouch(false)}
                    className="absolute top-12 left-3 flex flex-col rounded-md border bg-white py-3 shadow-md "
                  >
                    <Link href={`/portfolio/editor?project_id=${projectId}`}>
                      <a className="py-1 pl-4 pr-16 text-sm font-semibold text-black transition-colors hover:bg-blue-600 hover:text-white">
                        프로젝트 편집
                      </a>
                    </Link>
                    <span
                      onClick={onDeleteModalClick}
                      className="py-1 pl-4 pr-16 text-sm font-semibold text-black transition-colors hover:bg-blue-600 hover:text-white"
                    >
                      삭제
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="absolute bottom-0 flex h-16 w-full items-center rounded-md bg-gradient-to-t from-black/60 to-gray-600/0 px-4">
              <span className="relative top-2 font-semibold text-white hover:underline">
                {title}
              </span>
            </div>
          </>
        )}
        {!visible && (
          <div className="absolute right-3 top-3 flex items-center rounded-full bg-black/70 p-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-1 h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clipRule="evenodd"
              />
            </svg>

            <span className="text-xs">비공개</span>
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
