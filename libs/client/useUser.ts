import { idea_follow, idea_user } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";

export interface userWithFollow extends idea_user {
  followers: idea_follow[];
  followings: idea_follow[];
}

export interface useUserState {
  data?: {
    ok: boolean;
    profile?: userWithFollow;
  };
  error?: any;
  mutate: any;
}

export interface ProfileResponse {
  ok: boolean;
  profile: userWithFollow;
}

export default function useUser() {
  const { data, error }: useUserState =
    useSWR<ProfileResponse>("/api/users/me");
  const router = useRouter();

  useEffect(() => {
    // 로그인 하지 않았는데 Private 링크로 갔을 시 로그인 페이지로 이동
    if (data && !data.ok) {
      router.replace("/user/login");
    }
  }, [router, data]);
  return { user: data?.profile, isLoading: !data && !error };
}
