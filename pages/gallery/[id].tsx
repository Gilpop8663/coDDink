import Layout from "@components/layout";
import DeleteModal from "@components/profile/deleteModal";
import ClickedProject from "@components/project/clickedProject";
import useMutation from "@libs/client/useMutation";
import type {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
  NextPage,
  NextPageContext,
} from "next";
import { useRouter } from "next/router";
import {
  CommentProps,
  CommentResponse,
  CommentWithUser,
  DetailProjectResponse,
  GETCommentResponse,
  ProjectWithComment,
  ProjectWithCountWithUser,
} from "pages";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import client from "@libs/server/client";
import useSWR, { SWRConfig, unstable_serialize } from "swr";
import { withApiSession } from "@libs/server/withSession";
import { withSsrSession } from "@libs/server/withSsrSession";
import { CoddinkUser } from "@prisma/client";

const Gallery: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentProps>();

  const { data, mutate: userMutate } = useSWR("/api/users/me");
  const [commentPage, setCommentPage] = useState(1);
  const { data: detailData, mutate } = useSWR<DetailProjectResponse | null>(
    router.query.id
      ? [`/api/projects/${router.query.id}`, router.query.id]
      : null
  );

  const [isDelete, setIsDelete] = useState<null | "comment" | "project">(null);
  const [deleteCommentTarget, setDeleteCommentTarget] = useState<number | null>(
    null
  );
  const [
    deleteComment,
    { data: deleteCommentData, loading: deleteCommentLoading },
  ] = useMutation<CommentResponse>(
    `/api/projects/${router.query.id}/commentDelete`
  );
  const { data: getCommentsData, mutate: getCommentsMutate } =
    useSWR<GETCommentResponse | null>(
      router.query.id
        ? `/api/projects/${router.query.id}/comment?commentIdx=${commentPage}&id=${router.query.id}`
        : null
    );

  const [commentArr, setCommentArr] = useState<CommentWithUser[]>([]);

  const onMoreCommentClick = () => {
    setCommentPage((prev) => prev + 1);
  };
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
      `/api/projects/${detailData?.project?.id}/comment`
    );

  const onCommentValid = (value: CommentProps) => {
    if (commentLoading) return;
    if (!detailData) return;
    if (!data?.profile) return;
    mutate(
      {
        ...detailData,
        project: {
          ...detailData.project,
          _count: {
            ...detailData.project._count,
            comments: detailData.project._count.comments + 1,
          },
        },
      },
      false
    );
    sendComment(value);
  };

  const onCommentDeleteClick = (id: number | null) => {
    if (!detailData) return;
    if (!data?.profile) return;
    mutate(
      {
        ...detailData,
        project: {
          ...detailData.project,
          _count: {
            ...detailData.project._count,
            comments: detailData.project._count.comments - 1,
          },
        },
      },
      false
    );
    deleteComment({ commentId: id });
    setDeleteCommentTarget(null);
    setIsDelete(null);
  };

  const onDeleteModalClick = (
    id: number | null,
    kind: null | "comment" | "project"
  ) => {
    setIsDelete(kind);
    if (kind === "project") {
    } else if (kind === "comment") {
      setDeleteCommentTarget(id);
    }
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
      getCommentsMutate();
    }
  }, [commentData, reset, getCommentsMutate]);

  useEffect(() => {
    if (followData && followData.ok) {
      userMutate();
    }
  }, [followData, userMutate]);

  useEffect(() => {
    if (getCommentsData && getCommentsData.ok) {
      getCommentsMutate();
      setCommentArr(getCommentsData.comments);
    }
  }, [getCommentsData, getCommentsMutate]);

  useEffect(() => {
    if (deleteCommentData && deleteCommentData.ok) {
      getCommentsMutate();
    }
  }, [deleteCommentData, getCommentsMutate]);

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
    >
      {isDelete === "comment" && (
        <DeleteModal
          title="댓글 삭제"
          description="이 댓글을 삭제하시겠습니까?"
          onDeleteModalClick={() => onDeleteModalClick(null, null)}
          onProjectDeleteClick={() => onCommentDeleteClick(deleteCommentTarget)}
        ></DeleteModal>
      )}
      <div className="bg-zinc-50">
        {detailData?.ok && detailData.project && (
          <ClickedProject
            onDeleteModalClick={onDeleteModalClick}
            thumbnail={detailData?.project?.thumbnail}
            followingData={data?.profile?.followings}
            loginId={data?.profile?.id}
            onFollowClick={onFollowClick}
            kind="gallery"
            contents={detailData?.project?.contents}
            onLikeClick={onLikeClick}
            title={detailData?.project?.title}
            id={detailData?.project?.id}
            likes={detailData?.project?._count.like}
            views={detailData?.project?._count.view}
            owner={detailData?.project?.owner}
            avatar={detailData?.project?.user.avatar}
            userId={detailData?.project?.userId}
            createdAt={detailData?.project?.createdAt}
            isLiked={detailData?.isLiked}
            commentCount={detailData?.project?._count.comments}
            projectComments={commentArr || []}
            currentUserId={data?.profile?.id}
            onCommentValid={onCommentValid}
            isLogin={data && data.ok}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            tools={detailData?.project?.tools}
            category={detailData?.project?.category}
            tags={detailData?.project?.tags}
            relatedData={detailData?.relatedProjects}
            description={detailData?.project?.description}
            onMoreCommentClick={onMoreCommentClick}
            projectURL={detailData?.project?.linkURL}
          />
        )}
      </div>
    </Layout>
  );
};

interface NextPageProps {
  ok: boolean;
  project: ProjectWithComment[];
  relatedProjects: ProjectWithCountWithUser[];
  isLiked: boolean;
  query: string;
  profile: CoddinkUser | undefined;
}

const Page: NextPage<NextPageProps> = ({
  project,
  query,
  relatedProjects,
  isLiked,
  ok,
  profile,
}) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize([`/api/projects/${query}`, +query])]: {
            ok,
            project,
            relatedProjects,
            isLiked,
          },
          "/api/users/me": {
            ok: true,
            profile,
          },
        },
      }}
    >
      <Gallery />
    </SWRConfig>
  );
};

interface SsrProps {
  req: NextApiRequest;
}

export const getServerSideProps = withSsrSession(async function ({
  req,
}: SsrProps) {
  if (req.url?.slice(0, 5) !== "/gall") return { props: {} };
  const id = req.url?.includes("/gallery/")
    ? req.url.split("/gallery/")[1]
    : "1";
  const user = req?.session.user;

  let profile;
  if (user) {
    profile = await client.coddinkUser.findUnique({
      where: {
        id: req?.session.user?.id,
      },
      include: {
        followers: true,
        followings: true,
      },
    });
  }

  const project = await client.coddinkProject.findUnique({
    where: {
      id: Number(id),
    },

    include: {
      _count: {
        select: {
          like: true,
          comments: true,
          view: true,
        },
      },
      owner: {
        orderBy: {
          ownerIdx: "asc",
        },
        select: {
          name: true,
          userId: true,
          user: {
            select: {
              name: true,
              avatar: true,
              city: true,
              country: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
      contents: {
        orderBy: {
          contentIdx: "asc",
        },
      },
      tools: true,
      tags: true,
      category: true,
    },
  });
  const relatedProjects = await client.coddinkProject.findMany({
    where: {
      userId: project?.userId,
      isDraft: false,
      visible: true,
      AND: {
        id: {
          not: project?.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
    include: {
      _count: {
        select: {
          like: true,
        },
      },
      owner: {
        orderBy: {
          ownerIdx: "asc",
        },
        select: {
          name: true,
          userId: true,
          user: {
            select: {
              name: true,
              avatar: true,
              city: true,
              country: true,
            },
          },
        },
      },
    },
  });

  const isLiked = Boolean(
    await client.coddinkLike.findFirst({
      where: {
        projectId: Number(id),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  if (
    (project?.isDraft == true || project?.visible === false) &&
    project.owner[0].userId !== user?.id
  ) {
    return {
      props: {
        ok: false,
      },
    };
  }

  return {
    props: {
      ok: true,
      project: JSON.parse(JSON.stringify(project)),
      relatedProjects: JSON.parse(JSON.stringify(relatedProjects)),
      isLiked: isLiked,
      query: id?.toString(),
      profile: user ? JSON.parse(JSON.stringify(profile)) : {},
    },
  };
});

export default Page;
