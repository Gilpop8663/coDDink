import TextArea from "@components/textArea";
import NextButton from "@components/upload/nextButton";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ClickedFooter from "./clickedComponents/clickedFooter";
import ClickedInfo from "./clickedComponents/clickedInfo";
import ClickedHeader from "./clickedComponents/clikcedHeader";
import CommentInput from "./clickedComponents/commentInput";
import OwnerTab from "./clickedComponents/ownerTab";

interface ItemProps {
  kind: "home" | "gallery";
  title: string;
  id: number;
  likes: number;
  views: number;
  owner: string;
  avatar: string;
  userId: number;
  createdAt: Date;
  onLikeClick: () => void;
  onClick?: () => void;
  isLiked: boolean;
}

export default function ClickedProject({
  kind,
  title,
  id,
  likes,
  views,
  owner,
  avatar,
  userId,
  onClick,
  onLikeClick,
  createdAt,
  isLiked,
}: ItemProps) {
  const router = useRouter();
  const onBackClick = () => {
    router.back();
  };
  return (
    <div
      className={cls(
        kind === "home" ? "absolute left-0 top-0" : "",
        "flex w-screen justify-center"
      )}
    >
      {kind === "home" && (
        <div
          className="fixed top-0 left-0 z-10 h-screen w-screen bg-black opacity-90"
          onClick={onBackClick}
        ></div>
      )}
      <div
        className={cls(
          kind === "home" ? "z-20" : "z-0",
          "relative top-5 z-20 flex flex-col"
        )}
      >
        <ClickedHeader
          kind={kind}
          title={title}
          owner={owner}
          avatar={avatar}
          userId={userId}
        ></ClickedHeader>
        <div className="w-[1400px]">
          <div className="h-[1080px] bg-white"></div>
          <ClickedFooter
            onLikeClick={onLikeClick}
            createdAt={createdAt}
            title={title}
            likes={likes}
            views={views}
            isLiked={isLiked}
          />
          <div className="mb-24 border bg-gray-100 p-24">
            <div className="grid grid-cols-7 gap-7">
              <div className="col-span-5 flex max-h-52 flex-col border bg-white p-8">
                <CommentInput id={id} avatar={avatar}></CommentInput>
              </div>
              <div className="col-span-2">
                <OwnerTab
                  avatar={avatar}
                  userId={userId}
                  owner={owner}
                ></OwnerTab>
                <div className="mt-4 border bg-white p-8">
                  <ClickedInfo
                    kind="sidebar"
                    title={title}
                    createdAt={createdAt}
                    likes={likes}
                    views={views}
                  ></ClickedInfo>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
