import FacebookLogin from "@greatsumini/react-facebook-login";
import Image from "next/image";
import FACEBOOK_LOGO from "@public/facebook.svg";
import React from "react";

interface facebookBtnProps {
  facebookLogin: (data: any) => void;
}

interface ResponseProps {
  email: string;
  id: string;
  name: string;
}

export default function FacebookBtn({ facebookLogin }: facebookBtnProps) {
  const ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string;
  return (
    <FacebookLogin
      appId={ID}
      onSuccess={(res) => {
        console.log("로그인 성공!");
      }}
      onFail={(error) => {
        console.log("로그인 실패!");
      }}
      onProfileSuccess={(res: any) => {
        facebookLogin({ email: res.email, fullName: res.name });
      }}
      render={({ onClick }) => (
        <div
          onClick={onClick}
          className="flex h-16 w-full cursor-pointer items-center justify-center rounded-full border-2  hover:border-gray-300"
        >
          <Image
            src={FACEBOOK_LOGO}
            alt="facebook"
            height={16}
            width={16}
          ></Image>
          <span className="ml-4 font-semibold">Facebook으로 계속</span>
        </div>
      )}
    ></FacebookLogin>
  );
}
