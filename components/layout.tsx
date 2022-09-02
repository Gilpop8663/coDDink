import { idea_user } from "@prisma/client";
import React from "react";
import Header from "./header";

interface LayoutProps {
  isLogin: boolean | undefined;
  profile?: idea_user;
  children: React.ReactNode;
  kind?: "normal" | "profile";
  isTop?: boolean;
  userId: number | undefined;
}

export default function Layout({
  isLogin = false,
  profile,
  children,
  kind = "normal",
  userId,
  isTop,
}: LayoutProps) {
  return (
    <div className="">
      <Header
        isTop={isTop}
        isLogin={isLogin}
        profile={profile}
        kind={kind}
        userId={userId}
      />
      <div className="pt-16">{children}</div>
    </div>
  );
}
