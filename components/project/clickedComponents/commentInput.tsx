import TextArea from "@components/textArea";
import NextButton from "@components/upload/nextButton";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface CommentInputProps {
  id: number;
  avatar: string;
  register: UseFormRegisterReturn;
}

export default function CommentInput({
  avatar,
  id,
  register,
}: CommentInputProps) {
  return (
    <>
      <div className="grid grid-cols-10">
        <Link href={`/gallery/${id}`}>
          <a className="col-span-1 mr-4 cursor-pointer">
            <Image
              src={avatar}
              alt="profile"
              width={50}
              height={50}
              className="rounded-full"
            ></Image>
          </a>
        </Link>
        <div className="col-span-9">
          <TextArea
            register={register}
            placeholder="이 프로젝트에 대해 어떻게 생각하십니까?"
          ></TextArea>
        </div>
      </div>
      <div className="mt-2 w-24 self-end text-sm">
        <NextButton color="gray" label="댓글 게시"></NextButton>
      </div>
    </>
  );
}
