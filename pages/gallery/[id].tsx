import Layout from "@components/layout";
import ClickedProject from "@components/project/clickedProject";
import useMutation from "@libs/client/useMutation";
import { useUserState } from "@libs/client/useUser";
import { idea_project } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { DetailProjectResponse } from "pages";
import useSWR from "swr";

const Gallery: NextPage = () => {
  const router = useRouter();
  const { data, error }: useUserState = useSWR("/api/users/me");
  const { data: detailData, mutate } = useSWR<DetailProjectResponse | null>(
    router.query.id ? `/api/projects/${router.query.id}` : null
  );
  const [toggleLike] = useMutation(`/api/projects/${router.query.id}/like`);
  const onLikeClick = () => {
    if (!detailData) return;
    toggleLike({});
    mutate({ ...detailData, isLiked: !detailData.isLiked }, false);
  };
  return (
    <Layout isLogin={data && data.ok} profile={data?.profile}>
      {detailData && (
        <ClickedProject
          kind="gallery"
          onLikeClick={onLikeClick}
          title={detailData?.project.title}
          id={detailData?.project.id}
          likes={detailData?.project._count.like}
          views={detailData.project.view}
          owner={detailData.project.user.name}
          avatar={detailData.project.user.avatar}
          userId={detailData.project.userId}
          createdAt={detailData.project.createdAt}
          isLiked={detailData.isLiked}
        />
      )}
    </Layout>
  );
};

export default Gallery;
