import Layout from "@components/layout";
import ClickedProject from "@components/project/clickedProject";
import ProjectItem from "@components/project/projectItem";
import useMutation from "@libs/client/useMutation";
import { useUserState } from "@libs/client/useUser";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

export interface ProjectWithCountWithUser extends idea_project {
  _count: {
    like: number;
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

const Home: NextPage = () => {
  const router = useRouter();
  const path = router.asPath;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentProps>();

  const isGallery = path.slice(1, 8) === "gallery";

  const clickedId = path.slice(9);
  const { data, error }: useUserState = useSWR("/api/users/me");
  const { data: projectsData } = useSWR<ProjectsResponse>("/api/projects");
  const { data: detailData, mutate } = useSWR<DetailProjectResponse | null>(
    isGallery ? `/api/projects/${clickedId}` : null
  );
  const [toggleLike, { loading: likeLoading }] = useMutation(
    `/api/projects/${clickedId}/like`
  );

  console.log(projectsData);

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

  const onBoxClicked = (id: number) => {
    router.push(`/`, `/gallery/${id}`, { shallow: true });
  };

  useEffect(() => {
    if (commentData && commentData.ok) {
      reset();
      mutate();
    }
  }, [commentData, reset, mutate]);

  console.log(detailData?.project.owner);

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
    >
      <div className="grid grid-cols-5 gap-6 px-6 py-6">
        {projectsData?.projects?.map((item) => (
          <ProjectItem
            thumbnail={item.thumbnail}
            key={item.id}
            title={item.title}
            likes={item._count.like}
            views={1}
            owner={item.owner}
            onClick={() => onBoxClicked(item.id)}
          />
        ))}
        {detailData && (
          <ClickedProject
            kind="home"
            contents={detailData?.project.contents}
            onLikeClick={onLikeClick}
            title={detailData?.project.title}
            id={detailData?.project.id}
            likes={detailData?.project._count.like}
            views={detailData.project.view}
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

export default Home;
