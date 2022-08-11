import Layout from "@components/layout";
import NextButton from "@components/upload/nextButton";
import { useUserState } from "@libs/client/useUser";
import { idea_user } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  userInfo: idea_user;
}

const Profile: NextPage = () => {
  const { data, error }: useUserState = useSWR("/api/users/me");
  const router = useRouter();
  const { data: userData } = useSWR<ProfileResponse | null>(
    router.query.id ? `/api/users/${router.query.id}` : null
  );

  console.log(userData);

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
      kind="profile"
    >
      <div className="absolute top-0 -z-10 h-[260px] w-screen bg-stone-500"></div>
      <div className="px-14 pt-14">
        <div className="flex w-1/5 flex-col items-center bg-white p-8">
          <div className="mb-6 h-24 w-24">
            <Image
              className="rounded-full"
              src={userData?.userInfo?.avatar!}
              alt="avatar"
              width={250}
              height={250}
            ></Image>
          </div>
          <div className="text-2xl font-semibold ">
            {userData?.userInfo.name}
          </div>
          <div className="my-8 w-full">
            <NextButton color="blue" label="내 프로필 편집"></NextButton>
          </div>
          <div className="flex w-full items-center justify-between">
            <span>프로젝트 보기</span>
            <span>1</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
