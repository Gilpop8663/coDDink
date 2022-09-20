import Layout from "@components/layout";
import { useUserState } from "@libs/client/useUser";
import React from "react";
import useSWR from "swr";

export default function Custom404Page() {
  const { data }: useUserState = useSWR("/api/users/me");

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
    >
      <div className="fixed flex h-screen w-screen items-center justify-center text-3xl font-semibold">
        존재하지 않는 페이지입니다
      </div>
    </Layout>
  );
}
