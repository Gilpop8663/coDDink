import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { makeImageURL } from '@libs/client/utils';
import TextArea from '@components/textArea';
import NextButton from '@components/upload/NextButton';

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
      <div className="flex w-full grid-cols-10 items-start justify-between lg:grid">
        <Link href={`/gallery/${id}`}>
          <a className="relative mr-4 h-10 w-12 cursor-pointer md:h-12 lg:col-span-1 lg:mr-4 ">
            <Image
              src={makeImageURL(avatar, 'smAvatar')}
              alt="profile"
              layout="fill"
              className="rounded-full"
            ></Image>
          </a>
        </Link>
        <div className="w-full lg:col-span-9 lg:w-full">
          <TextArea
            register={register}
            placeholder="이 프로젝트에 대해 어떻게 생각하십니까?"
          ></TextArea>
        </div>
      </div>
      <div className="mt-2 w-24 self-end text-sm">
        <NextButton color="grayBtn" label="댓글 게시"></NextButton>
      </div>
    </>
  );
}
