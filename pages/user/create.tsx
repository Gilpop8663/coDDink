import Layout from "@components/layout";
import Image from "next/image";
import React from "react";
import NATURE_IMAGE from "@public/user-create.jpg";
import GOOGLE_LOGO from "@public/google.svg";
import FACEBOOK_LOGO from "@public/facebook.svg";
import APPLE_LOGO from "@public/apple.png";

export default function Create() {
  return (
    <div className="">
      <div className="fixed -z-10 h-screen w-screen bg-black bg-cover opacity-50"></div>
      <Image
        className="-z-20"
        alt="background"
        src={NATURE_IMAGE}
        layout="fill"
        objectFit="cover"
      ></Image>
      <div className="flex h-screen items-center justify-around">
        <div className="text-2xl text-white">1000 Ideas</div>
        <div className="z-10 flex h-4/5 w-1/4 flex-col bg-white py-12 px-10">
          <h2 className="text-3xl font-semibold ">계정 만들기</h2>
          <div className="flex items-center pt-4">
            <p className="mr-2 text-sm">이미 계정이 있으십니까?</p>
            <p className="cursor-pointer text-sm text-blue-600">로그인</p>
          </div>
          <h3 className="pt-6 font-semibold">소셜로 등록</h3>
          <div className="flex space-x-5 pt-6 transition-all">
            <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 hover:border-gray-300">
              <Image
                src={GOOGLE_LOGO}
                alt="google"
                height={30}
                width={30}
              ></Image>
            </div>
            <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full  hover:ring-2 hover:ring-gray-300">
              <Image
                src={FACEBOOK_LOGO}
                alt="facebook"
                height={60}
                width={60}
              ></Image>
            </div>
            <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-black hover:ring-4 hover:ring-gray-300">
              <Image
                src={APPLE_LOGO}
                alt="apple"
                height={25}
                width={25}
              ></Image>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="mt-10 h-[0.1px] w-full bg-gray-300"></div>
            <div className="absolute top-7 bg-white px-2">또는</div>
          </div>
          <div className="flex flex-col pt-6">
            <h3 className="font-semibold">이메일로 등록</h3>
            <span className="pt-4 text-xs">이메일 주소</span>
            <input
              type="email"
              className="border-b-2 transition-colors focus:border-blue-500 focus:outline-none"
            />
            <h4 className="pt-4 text-xs">이름</h4>
            <input
              type="text"
              className="border-b-2 transition-colors focus:border-blue-500 focus:outline-none"
            />
            <h4 className="pt-4 text-xs">암호</h4>
            <input
              type="password"
              className="border-b-2 transition-colors focus:border-blue-500 focus:outline-none"
            />
          </div>

          <span className="pt-4 text-sm font-semibold">필수 항목</span>
          <div className="flex items-start pt-4">
            <input type="checkbox" className="h-4 w-4" />
            <span className="ml-2 text-sm">
              개인정보 보호정책에 따라 내 개인 정보를 수집 및 사용에 동의합니다.
            </span>
          </div>
          <span className="ml-2 mt-4 text-sm">
            “계정 만들기”를 클릭함으로써 사용 약관 및 개인정보보호 정책을
            읽었으며 이에 동의한다고 확인합니다.
          </span>
          <div className="mt-4 flex w-28 cursor-pointer items-center justify-center self-end rounded-full bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            계정 만들기
          </div>
        </div>
      </div>
    </div>
  );
}
