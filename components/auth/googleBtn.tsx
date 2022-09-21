import React from "react";

import { cls } from "@libs/client/utils";

interface GoogleBtnProps {
  kind: "icon" | "text";
}

export default function GoogleBtn({ kind }: GoogleBtnProps) {
  return (
    <div className="">
      <div
        className={cls(
          kind === "text" ? " border-2" : "",
          "flex h-16 w-full cursor-pointer items-center justify-center rounded-full hover:border-gray-300"
        )}
      >
        <div
          className="g_id_signin"
          data-type={kind === "text" ? "standard" : "icon"}
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
