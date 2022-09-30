import React from "react";
import Image from "next/image";
import { cls } from "@libs/client/utils";
import GOOGLE_LOGO from "@public/google.svg";

interface GoogleBtnProps {
  kind: "icon" | "text";
  onGoogleLoginClick: () => void;
}

export default function GoogleBtn({
  kind,
  onGoogleLoginClick,
}: GoogleBtnProps) {
  return (
    <div className="" title="구글">
      {kind === "text" && (
        <div
          className={cls(
            kind === "text" ? " border-2" : "",
            "flex h-16 w-full cursor-pointer items-center justify-center rounded-full hover:border-gray-300"
          )}
          onClick={onGoogleLoginClick}
        >
          <Image src={GOOGLE_LOGO} alt="google" height={16} width={16}></Image>
          <span className="ml-4 font-semibold">Google로 계속</span>
        </div>
      )}
      {kind === "icon" && (
        <div
          onClick={onGoogleLoginClick}
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full  hover:ring-2 hover:ring-gray-300"
        >
          <Image src={GOOGLE_LOGO} alt="google" height={30} width={30}></Image>
        </div>
      )}
    </div>
  );
}
