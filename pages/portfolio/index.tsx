import Layout from "@components/layout";
import { useUserState } from "@libs/client/useUser";
import type { NextPage } from "next";
import useSWR from "swr";

const Live: NextPage = () => {
  const { data }: useUserState = useSWR("/api/users/me");

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
    >
      <div>안녕</div>
    </Layout>
  );
};

export default Live;
