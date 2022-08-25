import { cls, makeImageURL } from "@libs/client/utils";
import Image from "next/image";
import Link from "next/link";
import { OwnerProps } from "pages";
import React from "react";

interface ItemProps {
  kind: "home" | "gallery";
  title: string;
  avatar: string;
  userId: number;
  owner: OwnerProps[];
}

export default function ClickedHeader({
  kind,
  title,
  avatar,
  userId,
  owner,
}: ItemProps) {
  console.log(owner);
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
            <Link href={`/profile/${owner[0].userId}`}>
              <a className="cursor-pointer hover:underline">{owner[0].name}</a>
            </Link>
            <span>&bull;</span>
            <span className="cursor-pointer hover:underline">팔로우</span>
          </div>
        </div>
      </div>
    </div>
  );
}
