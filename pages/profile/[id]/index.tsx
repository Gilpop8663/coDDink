import Layout from "@components/layout";
import CategoryButton from "@components/profile/categoryButton";
import ClickedProject from "@components/project/clickedProject";
import ProjectItem from "@components/project/projectItem";
import NextButton from "@components/upload/nextButton";
import useMutation from "@libs/client/useMutation";
import { useUserState } from "@libs/client/useUser";
import { makeImageURL } from "@libs/client/utils";
import { idea_like, idea_project, idea_user } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  CommentProps,
  CommentResponse,
  DetailProjectResponse,
  ProjectWithCountWithUser,
} from "pages";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  userInfo: idea_user;
}

interface UserProjectsResponse {
  ok: boolean;
  projects: ProjectWithCountWithUser[];
}

interface ProjectWithCount extends idea_project {
  _count: { like: number };
}

interface LikeProjectWithCountWithUser extends idea_like {
  project: ProjectWithCount;
  user: {
    name: string;
    avatar: string;
  };
}

interface LikeProjectResponse {
  ok: boolean;
  projects: LikeProjectWithCountWithUser[];
}

interface ToggleResponse {
  ok: boolean;
}

const Profile: NextPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentProps>();
  const { data, error }: useUserState = useSWR("/api/users/me");
  const router = useRouter();
  const path = router.asPath;
  const isGallery = path.slice(1, 8) === "gallery";

  const isAppreciated = path.slice(-11) === "appreciated";
  const { data: userData } = useSWR<ProfileResponse | null>(
    router.query.id ? `/api/users/${router.query.id}` : null
  );

  const { data: userProjects } = useSWR<UserProjectsResponse>(
    router.query.id ? `/api/profile/${router.query.id}/projects` : null
  );

  const { data: likeProjects } = useSWR<LikeProjectResponse>(
    isAppreciated ? `/api/profile/${router.query.id}/appreciated` : null
  );

  const [kind, setKind] = useState<"projects" | "moodboards" | "appreciated">(
    "projects"
  );

  const onMoodboardClick = () => {
    setKind("moodboards");
    router.push(
      { pathname: "/profile/[id]", query: { id: router.query.id } },
      `/profile/${router.query.id}/moodboards`
    );
  };

  const onProjectClick = () => {
    setKind("projects");
    router.push(
      { pathname: "/profile/[id]", query: { id: router.query.id } },
      `/profile/${router.query.id}/projects`
    );
  };

  const onAppreciatedClick = () => {
    router.push(
      { pathname: "/profile/[id]", query: { id: router.query.id } },
      `/profile/${router.query.id}/appreciated`
    );
    setKind("appreciated");
  };

  const onBoxClicked = (id: number) => {
    router.push(
      { pathname: "/profile/[id]", query: { id: router.query.id } },
      `/gallery/${id}`
    );
  };

  console.log(isAppreciated);

  const clickedId = path.slice(9);

  const { data: detailData, mutate } = useSWR<DetailProjectResponse | null>(
    isGallery ? `/api/projects/${clickedId}` : null
  );
  const [toggleLike, { data: toggleData, loading: likeLoading }] =
    useMutation<ToggleResponse>(`/api/projects/${clickedId}/like`);

  const [sendComment, { data: commentData, loading: commentLoading }] =
    useMutation<CommentResponse>(
      `/api/projects/${detailData?.project?.id}/comment`
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
    if (userData && !userData.ok) {
      router.push("/");
    }
  }, [router, userData]);

  useEffect(() => {
    if (commentData && commentData.ok) {
      reset();
      mutate();
    }
  }, [commentData, reset, mutate, toggleData]);

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
      kind="profile"
    >
      <div className="absolute top-0 -z-10 h-[260px] w-screen bg-stone-500"></div>
      <div className="flex px-14 py-14">
        <div className="flex w-1/5 flex-col rounded-sm bg-white p-8 shadow-md">
          <div className="mb-6 h-24 w-24 self-center">
            <Image
              className="rounded-full"
              src={makeImageURL(userData?.userInfo?.avatar!, "smAvatar")}
              alt="avatar"
              width={250}
              height={250}
            ></Image>
          </div>
          <div className="self-center text-2xl font-semibold">
            {userData?.userInfo?.name}
          </div>
          <div className="mt-3 flex flex-col items-center text-sm text-gray-500">
            <span>3D artist</span>
            <Link href="http://taehoonpark.tv">
              <a className="cursor-pointer underline">http://taehoonpark.tv</a>
            </Link>
            <Link href="search">
              <a className="mt-4 flex cursor-pointer items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Seoul, Korea, Republic of</span>
              </a>
            </Link>
          </div>
          <div className="my-8 w-full space-y-2">
            <Link href={`/profile/${userData?.userInfo?.id}/editor`}>
              <a>
                <NextButton color="blue" label="내 프로필 편집"></NextButton>
              </a>
            </Link>
            <NextButton color="blue" label="팔로우"></NextButton>
            <NextButton color="gray" label="메세지"></NextButton>
          </div>
          <div className="flex w-full items-center justify-between">
            <span>프로젝트 보기</span>
            <span>1</span>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <span>평가</span>
            <span>1</span>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <span>팔로워</span>
            <span>1</span>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <span>팔로잉</span>
            <span>1</span>
          </div>
          <div className="mt-4 flex flex-col justify-start">
            <span className="text-xs font-semibold text-gray-600">웹</span>
            <div className="mt-3 flex space-x-2">
              <Link href="facebook">
                <a className="flex h-8 w-8 items-center justify-center rounded-full border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                  </svg>
                </a>
              </Link>
              <Link href="youtube">
                <a className="flex h-8 w-8 items-center justify-center rounded-full border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z" />
                  </svg>
                </a>
              </Link>
              <Link href="github">
                <a className="flex h-8 w-8 items-center justify-center rounded-full border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </Link>
              <Link href="twitter">
                <a className="flex h-8 w-8 items-center justify-center rounded-full border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                  </svg>
                </a>
              </Link>
              <Link href="instagram">
                <a className="flex h-8 w-8 items-center justify-center rounded-full border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.829 6.302c-.738-.034-.96-.04-2.829-.04s-2.09.007-2.828.04c-1.899.087-2.783.986-2.87 2.87-.033.738-.041.959-.041 2.828s.008 2.09.041 2.829c.087 1.879.967 2.783 2.87 2.87.737.033.959.041 2.828.041 1.87 0 2.091-.007 2.829-.041 1.899-.086 2.782-.988 2.87-2.87.033-.738.04-.96.04-2.829s-.007-2.09-.04-2.828c-.088-1.883-.973-2.783-2.87-2.87zm-2.829 9.293c-1.985 0-3.595-1.609-3.595-3.595 0-1.985 1.61-3.594 3.595-3.594s3.595 1.609 3.595 3.594c0 1.985-1.61 3.595-3.595 3.595zm3.737-6.491c-.464 0-.84-.376-.84-.84 0-.464.376-.84.84-.84.464 0 .84.376.84.84 0 .463-.376.84-.84.84zm-1.404 2.896c0 1.289-1.045 2.333-2.333 2.333s-2.333-1.044-2.333-2.333c0-1.289 1.045-2.333 2.333-2.333s2.333 1.044 2.333 2.333zm-2.333-12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.958 14.886c-.115 2.545-1.532 3.955-4.071 4.072-.747.034-.986.042-2.887.042s-2.139-.008-2.886-.042c-2.544-.117-3.955-1.529-4.072-4.072-.034-.746-.042-.985-.042-2.886 0-1.901.008-2.139.042-2.886.117-2.544 1.529-3.955 4.072-4.071.747-.035.985-.043 2.886-.043s2.14.008 2.887.043c2.545.117 3.957 1.532 4.071 4.071.034.747.042.985.042 2.886 0 1.901-.008 2.14-.042 2.886z" />
                  </svg>
                </a>
              </Link>
              <Link href="linkedin">
                <a className="flex h-8 w-8 items-center justify-center rounded-full border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              </Link>
              <Link href="twitch">
                <a className="flex h-8 w-8 items-center justify-center rounded-full border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10.224 17.806l1.776-1.776h3.343l2.09-2.09v-6.686h-10.03v8.776h2.821v1.776zm3.866-8.149h1.254v3.653h-1.254v-3.653zm-3.344 0h1.254v3.653h-1.254v-3.653zm1.254-9.657c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.687 14.567l-3.657 3.657h-2.716l-1.777 1.776h-1.88v-1.776h-3.344v-9.821l.941-2.403h12.433v8.567z" />
                  </svg>
                </a>
              </Link>
              <Link href="dribble">
                <a className="flex h-8 w-8 items-center justify-center rounded-full border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.455 9.985c-1.419.417-3.11.632-5.067.646.405-1.654 1.518-3.03 3.003-3.784.777 1.016 1.464 2.063 2.064 3.138zm.965 1.93c-.124-.28-.254-.559-.391-.835-1.622.51-3.561.769-5.804.772l-.008.148c0 1.404.504 2.692 1.34 3.695 1.266-1.901 2.891-3.164 4.863-3.78zm-3.97 4.641c1.569 1.225 3.671 1.589 5.624.836-.252-1.488-.65-2.94-1.19-4.352-1.819.542-3.285 1.714-4.434 3.516zm7.075-9.13c-.977-.754-2.197-1.209-3.525-1.209-.49 0-.964.068-1.418.184.764 1.028 1.441 2.086 2.035 3.172 1.236-.524 2.204-1.24 2.908-2.147zm8.475 4.574c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-5 0c0-3.866-3.135-7-7-7s-7 3.134-7 7 3.135 7 7 7 7-3.134 7-7zm-5.824-1.349c.157.324.305.651.447.98 1.26-.217 2.641-.204 4.143.042-.073-1.292-.566-2.474-1.354-3.403-.807 1.005-1.89 1.798-3.236 2.381zm.914 2.132c.489 1.309.865 2.651 1.119 4.023 1.312-.88 2.241-2.284 2.497-3.909-1.317-.228-2.522-.268-3.616-.114z" />
                  </svg>
                </a>
              </Link>
            </div>
            {/* <div className="mt-4 flex flex-col justify-start">
              <span className="text-xs font-semibold text-gray-600">
                근무 경력
              </span>
              <div className="mt-3 flex flex-col text-sm">
                <span className="font-semibold text-gray-800">C4D artist</span>
                <span className="text-gray-400">
                  The Mill Group, Inc — Los Angeles, CA, USA
                </span>
              </div>
              <div className="mt-3 flex flex-col text-sm">
                <span className="font-semibold text-gray-800">C4D artist</span>
                <span className="text-gray-400">
                  Giantstep — Korea, Republic of
                </span>
              </div>
            </div> */}
            <div className="mt-8 flex flex-col justify-start">
              <span className="text-xs font-semibold text-gray-500">
                ABOUT ME
              </span>
              <div className="mt-4 whitespace-pre-line text-sm text-gray-800">
                {`My name is Taehoon park and I'm 3D artist, motion graphic designer.\n
                I mainly use Cinema4d and After effects. I'm really into title design, experimental work, short animation.\n
                You can see my motion works right down here! https://vimeo.com/pth0427`}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-sm border p-3">
            <span className="text-xs font-semibold text-gray-500">
              가장 많이 사용된 도구
            </span>
            <div className="mt-4 flex flex-col space-y-2">
              <div className="flex cursor-pointer justify-center rounded-md bg-orange-300 py-3">
                <span className="font-bold text-white">React</span>
              </div>
              <div className="flex cursor-pointer justify-center rounded-md bg-purple-300 py-3">
                <span className="font-bold text-white">NextJS</span>
              </div>
              <div className="flex cursor-pointer justify-center rounded-md bg-purple-300 py-3">
                <span className="font-bold text-white">Django</span>
              </div>
              <div className="flex cursor-pointer justify-center rounded-md bg-purple-300 py-3">
                <span className="font-bold text-white">Javascript</span>
              </div>
            </div>
          </div>

          <div className="mt-2 flex w-full items-center justify-center">
            <span className="mt-8 text-xs font-semibold text-gray-600">
              {`멤버 가입일: 2014년 3월 13일`}
            </span>
          </div>
          <div className="mt-4 flex justify-center space-x-3 text-sm text-gray-400">
            <span className="cursor-pointer transition-colors hover:text-gray-700">
              신고
            </span>
            <span>|</span>
            <span className="cursor-pointer transition-colors hover:text-gray-700">
              차단
            </span>
          </div>
        </div>
        <div className="relative top-48 w-full pl-14">
          <div className="w-full">
            <div className="flex space-x-3">
              <CategoryButton
                onClick={onProjectClick}
                label="작업"
                isSame={kind === "projects"}
              />
              {/* <CategoryButton
                onClick={onMoodboardClick}
                label="무드보드"
                isSame={kind === "moodboards"}
              /> */}
              <CategoryButton
                onClick={onAppreciatedClick}
                label="평가"
                isSame={kind === "appreciated"}
              />
            </div>
            <div className="mt-6 grid w-full grid-cols-4 gap-6">
              {kind === "projects" &&
                userProjects?.projects?.map((item) => (
                  <ProjectItem
                    key={item.id}
                    title={item.title}
                    id={item.id}
                    likes={item._count?.like}
                    views={1}
                    owner={item.user.name}
                    avatar={item.user.avatar}
                    userId={item.userId}
                    onClick={() => onBoxClicked(item.id)}
                  />
                ))}
              {kind === "appreciated" &&
                likeProjects?.projects?.map((item) => (
                  <ProjectItem
                    key={item.project.id}
                    title={item.project.title}
                    id={item.project.id}
                    likes={item.project._count?.like}
                    views={1}
                    owner={item.user.name}
                    avatar={item.user.avatar}
                    userId={item.userId}
                    onClick={() => onBoxClicked(item.projectId)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
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
          commentCount={detailData.project._count.comments}
          projectComments={detailData.project.comments}
          currentUserId={data?.profile?.id}
          onCommentValid={onCommentValid}
          isLogin={data && data.ok}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Layout>
  );
};

export default Profile;
