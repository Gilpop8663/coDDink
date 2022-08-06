import Layout from "@components/layout";
import ClickedProject from "@components/project/clickedProject";
import ProjectItem from "@components/project/projectItem";
import { useUserState } from "@libs/client/useUser";
import { idea_project } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

interface ProjectsResponse {
  ok: boolean;
  projects: idea_project[];
}

const Home: NextPage = () => {
  const router = useRouter();
  const { data, error }: useUserState = useSWR("/api/users/me");
  const { data: projectsData } = useSWR<ProjectsResponse>("/api/projects");

  const path = router.asPath;

  const isClicked = path.includes("/gallery");

  const clickedId = path.slice(9);

  const detailProject = projectsData?.projects.filter(
    (item) => item.id === +clickedId
  )[0];

  console.log(detailProject);

  const onBoxClicked = (id: number) => {
    router.replace(`/`, `/gallery/${id}`, { shallow: true });
  };
  return (
    <Layout isLogin={data && data.ok} profile={data?.profile}>
      <div className="grid grid-cols-5 gap-6 px-6 py-6">
        {projectsData?.projects?.map((item) => (
          <ProjectItem
            key={item.id}
            title={item.title}
            id={item.id}
            likes={item.like}
            views={1}
            owner={item.owner}
            avatar={item.avatar}
            userId={item.userId}
            onClick={() => onBoxClicked(item.id)}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
