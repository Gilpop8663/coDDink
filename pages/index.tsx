import Layout from "@components/layout";
import ClickedProject from "@components/project/clickedProject";
import ProjectItem from "@components/project/projectItem";
import useMutation from "@libs/client/useMutation";
import { useUserState } from "@libs/client/useUser";
import { idea_project } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

export interface ProjectWithCountWithUser extends idea_project {
  _count: {
    like: number;
  };
  user: {
    avatar: string;
    name: string;
  };
}

interface ProjectsResponse {
  ok: boolean;
  projects: ProjectWithCountWithUser[];
}

export interface DetailProjectResponse {
  ok: boolean;
  project: ProjectWithCountWithUser;
  relatedProjects: idea_project[];
  isLiked: boolean;
}

const Home: NextPage = () => {
  const router = useRouter();
  const path = router.asPath;
  const clickedId = path.slice(9);
  const { data, error }: useUserState = useSWR("/api/users/me");
  const { data: projectsData } = useSWR<ProjectsResponse>("/api/projects");
  const { data: detailData, mutate } = useSWR<DetailProjectResponse | null>(
    clickedId ? `/api/projects/${clickedId}` : null
  );
  const [toggleLike] = useMutation(`/api/projects/${clickedId}/like`);
  const onLikeClick = () => {
    if (!detailData) return;
    toggleLike({});
    mutate({ ...detailData, isLiked: !detailData.isLiked }, false);
  };

  const onBoxClicked = (id: number) => {
    router.push(`/`, `/gallery/${id}`, { shallow: true });
  };
  return (
    <Layout isLogin={data && data.ok} profile={data?.profile}>
      <div className="grid grid-cols-5 gap-6 px-6 py-6">
        {projectsData?.projects?.map((item) => (
          <ProjectItem
            key={item.id}
            title={item.title}
            id={item.id}
            likes={item._count.like}
            views={1}
            owner={item.user.name}
            avatar={item.user.avatar}
            userId={item.userId}
            onClick={() => onBoxClicked(item.id)}
          />
        ))}
        {detailData && (
          <ClickedProject
            kind="home"
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
      </div>
    </Layout>
  );
};

export default Home;
