import NextButton from "@components/upload/nextButton";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import GOOGLE_LOGO from "@public/google.svg";
import FACEBOOK_LOGO from "@public/facebook.svg";
import APPLE_LOGO from "@public/apple.png";
import { OwnerProps } from "pages";

interface InfoProps {
  owner: OwnerProps[];
}

export default function ClickedLoginInfo({ owner }: InfoProps) {
  return (
    <div className="flex max-h-52 flex-col border bg-white p-8">
      <h3 className="text-xl font-semibold lg:text-3xl">
        대화에 참여하려면 등록
      </h3>
      <span className="mt-2">
        {`로그인하거나 등록하여 ${owner[0].name} 님의 프로젝트에 대해 피드백을
      제공해 주세요.`}
      </span>
      <div className="mt-5 flex items-center space-x-2">
        <Link href="/user/login">
          <a className="w-32 text-sm">
            <NextButton color="blueBtn" label="이메일로 등록"></NextButton>
          </a>
        </Link>
        <span className="text-sm font-semibold text-gray-400">또는</span>
        <Link href="/user/login">
          <a className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 hover:border-gray-300">
            <Image
              src={GOOGLE_LOGO}
              alt="google"
              height={15}
              width={15}
            ></Image>
          </a>
        </Link>
        <Link href="/user/login">
          <a className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full  hover:ring-2 hover:ring-gray-300">
            <Image
              src={FACEBOOK_LOGO}
              alt="facebook"
              height={30}
              width={30}
            ></Image>
          </a>
        </Link>
        {/* <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black hover:ring-2 hover:ring-gray-300">
          <Image src={APPLE_LOGO} alt="apple" height={15} width={15}></Image>
        </div> */}
      </div>
    </div>
  );
}
