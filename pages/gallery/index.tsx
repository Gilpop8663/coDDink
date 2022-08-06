import Layout from "@components/layout";
import { useUserState } from "@libs/client/useUser";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

const Gallery: NextPage = () => {
  const { data, error }: useUserState = useSWR("/api/users/me");

  return (
    <Layout isLogin={data && data.ok} profile={data?.profile}>
      <div>안녕</div>
    </Layout>
  );
};

export default Gallery;
