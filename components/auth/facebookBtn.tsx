import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import Image from "next/image";
import FACEBOOK_LOGO from "@public/facebook.svg";

interface facebookBtnProps {
  facebookLogin: (data: any) => void;
  kind: "icon" | "text";
}

interface ResponseProps {
  email: string;
  id: string;
  name: string;
}

export default function FacebookBtn({ facebookLogin, kind }: facebookBtnProps) {
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
      render={({ onClick }) => {
        if (kind === "text") {
          return (
            <div
              title="페이스북"
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
          );
        } else {
          return (
            <div
              title="페이스북"
              onClick={onClick}
              className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full  hover:ring-2 hover:ring-gray-300"
            >
              <Image
                src={FACEBOOK_LOGO}
                alt="facebook"
                height={60}
                width={60}
              ></Image>
            </div>
          );
        }
      }}
    ></FacebookLogin>
  );
}
