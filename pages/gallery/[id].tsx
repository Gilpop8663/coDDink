import Layout from "@components/layout";
import ClickedProject from "@components/project/clickedProject";
import useMutation from "@libs/client/useMutation";
import { useUserState } from "@libs/client/useUser";
import { idea_project } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { CommentProps, CommentResponse, DetailProjectResponse } from "pages";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

const Gallery: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentProps>();

  const { data, error, mutate: userMutate } = useSWR("/api/users/me");
  const { data: detailData, mutate } = useSWR<DetailProjectResponse | null>(
    router.query.id ? `/api/projects/${router.query.id}` : null
  );
  const [sendFollow, { data: followData, loading: followLoading }] =
    useMutation<CommentResponse>("/api/users/follow");

  const onFollowClick = (id: number) => {
    if (followLoading) return;
    sendFollow({ id: id, myId: data?.profile?.id });
  };

  const [toggleLike, { loading: likeLoading }] = useMutation(
    `/api/projects/${router.query.id}/like`
  );

  const [sendComment, { data: commentData, loading: commentLoading }] =
    useMutation<CommentResponse>(
      `/api/projects/${detailData?.project.id}/comment`
    );

  const onCommentValid = (value: CommentProps) => {
    if (commentLoading) return;
    sendComment(value);
  };

  const onLikeClick = () => {
    if (!detailData) return;
    mutate(
      {
        ...detailData,
        project: {
          ...detailData.project,
          _count: {
            ...detailData.project._count,
            like: detailData.isLiked
              ? detailData.project._count.like - 1
              : detailData.project._count.like + 1,
          },
        },
        isLiked: !detailData.isLiked,
      },
      false
    );
    if (likeLoading) return;
    toggleLike({});
  };

  useEffect(() => {
    if (commentData && commentData.ok) {
      reset();
      mutate();
    }
  }, [commentData, reset, mutate]);

  useEffect(() => {
    if (followData && followData.ok) {
      userMutate();
    }
  }, [followData, userMutate]);

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
    >
      <div className="bg-zinc-50">
        {detailData && (
          <ClickedProject
            followingData={data?.profile?.followings}
            loginId={data?.profile?.id}
            onFollowClick={onFollowClick}
            kind="gallery"
            contents={detailData.project.contents}
            onLikeClick={onLikeClick}
            title={detailData?.project.title}
            id={detailData?.project.id}
            likes={detailData?.project._count.like}
            views={detailData.project._count.view}
            owner={detailData.project.owner}
            avatar={detailData.project.user.avatar}
            userId={detailData.project.userId}
            createdAt={detailData.project.createdAt}
            isLiked={detailData.isLiked}
            commentCount={detailData.project._count.comments}
            projectComments={detailData.project.comments}
            currentUserId={data?.profile?.id}
            onCommentValid={onCommentValid}
            isLogin={data && data.ok}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            tools={detailData.project.tools}
            category={detailData.project.category}
            tags={detailData.project.tags}
            relatedData={detailData.relatedProjects}
            description={detailData.project.description}
          />
        )}
      </div>
    </Layout>
  );
};

export default Gallery;
