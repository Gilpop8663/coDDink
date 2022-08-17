import Layout from "@components/layout";
import { useUserState } from "@libs/client/useUser";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

const Live: NextPage = () => {
  const { data, error }: useUserState = useSWR("/api/users/me");

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
    >
      <div className="grid grid-cols-5 gap-6 px-6 py-6">
        <div className="cursor-pointer">
          <div className="rounded-md bg-gradient-to-t from-black/100 to-black/50">
            <div className="h-64 rounded-md bg-orange-500 transition-all hover:opacity-90"></div>
          </div>
          <div className="items-base flex justify-between pt-2">
            <h3 className="w-fit text-sm font-semibold text-gray-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
              voluptate incidunt explicabo possimus aliquam a repellendus ut ad,
              accusamus recusandae magni nostrum. Vero quos quod unde facilis
              nostrum nobis rem!
            </h3>
            <div className="h-6 w-6 rounded-sm bg-blue-500"></div>
          </div>
          <div className="flex  items-center space-x-1 pt-2 text-xs text-gray-600">
            <div className="h-5 w-5 rounded-full bg-purple-400"></div>
            <span>Adobe Live</span>
            <span>&bull;</span>
            <span>한 시간 전</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Live;
