import { idea_user } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";

export interface useUserState {
  data?: {
    ok: boolean;
    profile: idea_user;
  };
  error?: any;
}

export default function useUser() {
  const { data, error }: useUserState = useSWR("/api/users/me");
  const router = useRouter();

  useEffect(() => {
    // 로그인 하지 않았는데 Private 링크로 갔을 시 로그인 페이지로 이동
    if (data && !data.ok) {
      router.replace("/login");
    }
  }, [router, data]);
  return { user: data?.profile, isLoading: !data && !error };
}
