import HeadMeta from "@components/headMeta";
import Layout from "@components/layout";
import DeleteModal from "@components/profile/deleteModal";
import ClickedProject from "@components/project/clickedProject";
import ProjectItem from "@components/project/projectItem";
import useMutation from "@libs/client/useMutation";
import { ProfileResponse } from "@libs/client/useUser";
import {
  idea_comment,
  idea_project,
  idea_projectCategory,
  idea_projectContent,
  idea_projectTag,
  idea_projectTool,
} from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { SWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import client from "@libs/server/client";
import LoadingSpinner from "@components/loadingSpinner";

export interface ProjectWithCountWithUser extends idea_project {
  _count: {
    like: number;
    view: number;
  };
  user: {
    avatar: string;
    name: string;
  };
  owner: OwnerProps[];
}
export interface OwnerProps {
  name: string;
  userId: number;
  user: {
    avatar: string;
    city: string;
    country: string;
  };
}

export interface LikeProjectWithCountWithUser extends idea_project {
  _count: {
    like: number;
  };
  user: {
    avatar: string;
    name: string;
  };
}

export interface CommentWithUser extends idea_comment {
  user: {
    avatar: string;
    name: string;
    id: string;
  };
}

export interface ProjectWithComment extends idea_project {
  _count: {
    like: number;
    comments: number;
    view: number;
  };
  user: {
    avatar: string;
    name: string;
  };
  owner: OwnerProps[];
  comments: CommentWithUser[];
  contents: idea_projectContent[];
  category: idea_projectCategory[];
  tools: idea_projectTool[];
  tags: idea_projectTag[];
}

interface ProjectsResponse {
  ok: boolean;
  projects: ProjectWithCountWithUser[];
}

export interface DetailProjectResponse {
  ok: boolean;
  project: ProjectWithComment;
  relatedProjects: ProjectWithCountWithUser[];
  isLiked: boolean;
}

export interface CommentProps {
  comment: string;
}

export interface CommentResponse {
  ok: boolean;
}

export interface GETCommentResponse {
  ok: boolean;
  comments: CommentWithUser[];
}

const Home: NextPage = () => {
  const router = useRouter();
  const {
    data,
    error,
    mutate: userMutate,
  } = useSWR<ProfileResponse>("/api/users/me");
  const path = router.asPath;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentProps>();
  const isGallery = path.slice(1, 8) === "gallery";

  const clickedId = path.slice(9);
  const [isFinishData, setIsFinishData] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleteProject, { data: deleteData }] = useMutation<CommentResponse>(
    "/api/projects/delete"
  );

  const [commentPage, setCommentPage] = useState(1);

  const { data: detailData, mutate } = useSWR<DetailProjectResponse | null>(
    isGallery ? `/api/projects/${clickedId}` : null
  );

  const { data: getCommentsData, mutate: getCommentsMutate } =
    useSWR<GETCommentResponse | null>(
      isGallery
        ? `/api/projects/${clickedId}/comment?commentIdx=${commentPage}&id=${clickedId}`
        : null
    );

  const onMoreCommentClick = () => {
    setCommentPage((prev) => prev + 1);
    mutate();
  };

  const [sendFollow, { data: followData, loading: followLoading }] =
    useMutation<CommentResponse>("/api/users/follow");

  const onFollowClick = (id: number) => {
    if (followLoading) return;
    if (!data?.profile) return;
    sendFollow({ id: id, myId: data?.profile?.id });
  };

  const { data: defaultProjectsData, mutate: defaultProjectsMutate } =
    useSWR<ProjectsResponse>("/api/projects");

  const getKey = (pageIndex: number, previousPageData: ProjectsResponse) => {
    if (previousPageData && !previousPageData.projects) {
      setIsFinishData(false);
      return null; // 끝에 도달
    }

    return `/api/projects?page=${pageIndex}`; // SWR 키
  };

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const {
    data: projectsInfiniteData,
    size,
    setSize,

    mutate: projectsMutate,
  } = useSWRInfinite<ProjectsResponse>(getKey, fetcher);

  const projectsData = projectsInfiniteData
    ? {
        ok: true,
        projects: projectsInfiniteData.map((item) => item.projects).flat(),
      }
    : defaultProjectsData;

  const [toggleLike, { loading: likeLoading }] = useMutation(
    `/api/projects/${clickedId}/like`
  );

  const [sendComment, { data: commentData, loading: commentLoading }] =
    useMutation<CommentResponse>(
      `/api/projects/${detailData?.project.id}/comment`
    );

  const [sendView] = useMutation("/api/projects/view");

  const [commentArr, setCommentArr] = useState<CommentWithUser[]>([]);

  const onCommentValid = (value: CommentProps) => {
    if (commentLoading) return;
    sendComment(value);
  };

  const onLikeClick = () => {
    if (!detailData) return;
    if (!data?.profile) return;
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

  const onBoxClicked = (id: number) => {
    sendView({ projectId: id });
    router.push(`/`, `/gallery/${id}`, { shallow: true });
  };

  const onDeleteModalClick = (id: number | null) => {
    setIsDelete((prev) => !prev);
    setDeleteTarget(id);
  };

  const onProjectDeleteClick = (id: number | null) => {
    if (id === null) return;
    deleteProject({ projectId: id });
    setDeleteTarget(null);
    setIsDelete(false);
  };

  function handleScroll() {
    if (
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.scrollHeight
    ) {
      setSize((p) => p + 1);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  useEffect(() => {
    if (deleteData && deleteData.ok) {
      projectsMutate();
    }
  }, [deleteData, projectsMutate]);

  useEffect(() => {
    if (getCommentsData && getCommentsData.ok) {
      getCommentsMutate();
      setCommentArr(getCommentsData.comments);
    }
  }, [getCommentsData, getCommentsMutate]);

  useEffect(() => {
    if (!projectsData?.projects) {
      setIsFinishData(false);
    }
  }, []);

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
    >
      <HeadMeta></HeadMeta>
      {isDelete && (
        <DeleteModal
          title="프로젝트 삭제"
          description="이 프로젝트를 삭제하시겠습니까?"
          onDeleteModalClick={() => onDeleteModalClick(null)}
          onProjectDeleteClick={() => onProjectDeleteClick(deleteTarget)}
        ></DeleteModal>
      )}
      <div className="grid grid-cols-5 gap-6 px-6 py-6">
        {projectsData?.projects &&
          projectsData?.projects?.map((item) => (
            <ProjectItem
              projectId={item?.id}
              visible={item?.visible}
              followingData={data?.profile?.followings}
              loginId={data?.profile?.id}
              thumbnail={item?.thumbnail}
              key={item?.id}
              title={item?.title}
              likes={item?._count?.like}
              views={item?._count?.view}
              owner={item?.owner}
              onClick={() => onBoxClicked(item?.id)}
              onFollowClick={onFollowClick}
              onDeleteModalClick={() => onDeleteModalClick(item?.id)}
            />
          ))}
        {detailData && (
          <ClickedProject
            onMoreCommentClick={onMoreCommentClick}
            thumbnail={detailData.project.thumbnail}
            followingData={data?.profile?.followings}
            loginId={data?.profile?.id}
            onFollowClick={onFollowClick}
            kind="home"
            contents={detailData?.project.contents}
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
            projectComments={commentArr || []}
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
      <div className="flex justify-center py-12">
        {isFinishData && <LoadingSpinner />}
      </div>
    </Layout>
  );
};

// const Page: NextPage<{ projects: ProjectWithCountWithUser[] }> = ({
//   projects,
// }) => {
//   return (
//     <SWRConfig
//       value={{
//         fallback: {
//           "/api/projects": {
//             ok: true,
//             projects,
//           },
//         },
//       }}
//     >
//       <Home />
//     </SWRConfig>
//   );
// };

// export async function getServerSideProps() {
//   const projects = await client.idea_project.findMany({
//     where: {
//       isDraft: false,
//       visible: true,
//     },
//     include: {
//       user: {
//         select: {
//           avatar: true,
//           name: true,
//         },
//       },
//       _count: {
//         select: {
//           like: true,
//           view: true,
//         },
//       },
//       owner: {
//         orderBy: {
//           id: "desc",
//         },
//         select: {
//           name: true,
//           userId: true,
//           user: {
//             select: {
//               avatar: true,
//               city: true,
//               country: true,
//             },
//           },
//         },
//       },
//     },
//     take: 5,
//   });

//   return {
//     props: {
//       projects: JSON.parse(JSON.stringify(projects)),
//     },
//   };
// }

export default Home;
