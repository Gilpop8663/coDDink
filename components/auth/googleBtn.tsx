import Image from "next/image";
import React from "react";
import GOOGLE_LOGO from "@public/google.svg";

export default function GoogleBtn() {
  return (
    <div>
      <div className="flex h-16 w-full cursor-pointer items-center justify-center rounded-full border-2 hover:border-gray-300">
        {/* <Image src={GOOGLE_LOGO} alt="google" height={16} width={16}></Image>
        <span className="ml-4 font-semibold">Google로 계속</span> */}
        <div
          className="g_id_signin"
          data-type="standard"
          data-size="large"
          data-theme="outline"
          data-text="sign_in_with"
          data-shape="pill"
          data-logo_alignment="left"
        ></div>
      </div>
      <div
        id="g_id_onload"
        data-client_id="691707762640-i8gqdf86ntht6dmd02a1t5c8mdn6c998.apps.googleusercontent.com"
        data-callback="handleCredentialResponse"
        data-auto_prompt="false"
      ></div>
    </div>
  );
}
