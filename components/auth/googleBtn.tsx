import Image from "next/image";
import React from "react";
import GOOGLE_LOGO from "@public/google.svg";

export default function GoogleBtn() {
  return (
    <div>
      <label
        className="flex h-16 w-full cursor-pointer items-center justify-center rounded-full border-2 hover:border-gray-300"
        htmlFor="google"
      >
        <Image src={GOOGLE_LOGO} alt="google" height={16} width={16}></Image>
        <span className="ml-4 font-semibold">Google로 계속</span>
      </label>
    </div>
  );
}
