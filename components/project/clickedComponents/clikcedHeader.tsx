import { cls, makeImageURL } from "@libs/client/utils";
import { idea_follow } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { OwnerProps } from "pages";
import React from "react";
import OwnerInfo from "../ownerInfo";

interface ItemProps {
  kind: "home" | "gallery";
  title: string;
  owner: OwnerProps[];
  onFollowClick: (id: number) => void;
  loginId: number | undefined;
  followingData: idea_follow[] | undefined;
}

export default function ClickedHeader({
  kind,
  title,
  owner,
  onFollowClick,
  loginId,
  followingData,
}: ItemProps) {
  return (
    <div className={cls(kind === "home" ? "text-white" : "text-black", "flex")}>
      <div className="mb-5 flex items-center">
        <Link href={`/profile/${owner[0]?.userId}`}>
          <a>
            <Image
              src={makeImageURL(owner[0]?.user?.avatar, "smAvatar")}
              className="cursor-pointer rounded-full hover:opacity-90"
              height={40}
              width={40}
              alt="profile"
            ></Image>
          </a>
        </Link>
        <div className="ml-3 flex flex-col">
          <span className="font-semibold">{title}</span>
          <div className="flex items-center space-x-2 text-sm">
            <OwnerInfo
              followingData={followingData}
              loginId={loginId}
              kind="detail"
              path={kind}
              onFollowClick={onFollowClick}
              owner={owner}
            ></OwnerInfo>
            {/* <Link href={`/profile/${owner[0].userId}`}>
              <a className="cursor-pointer hover:underline">{owner[0].name}</a>
            </Link> */}
            <span>&bull;</span>
            {owner.length === 1 && loginId !== owner[0].userId && (
              <span
                className="cursor-pointer hover:underline"
                onClick={() => onFollowClick(owner[0].userId)}
              >
                {followingData?.find(
                  (ele) => ele.followerId === owner[0].userId
                )
                  ? "팔로잉"
                  : "팔로우"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
