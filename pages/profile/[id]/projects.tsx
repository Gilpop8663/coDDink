import Layout from "@components/layout";
import { useUserState } from "@libs/client/useUser";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const ProfileProjects: NextPage = () => {
  const { data, error }: useUserState = useSWR("/api/users/me");

  const router = useRouter();

  const userId = router.query.id;

  //   console.log(userId);
  useEffect(() => {
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  }, [router, userId]);
  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
    >
      <></>
    </Layout>
  );
};

export default ProfileProjects;
