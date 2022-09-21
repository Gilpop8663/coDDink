import HeadMeta from "@components/headMeta";
import Layout from "@components/layout";
import CategoryButton from "@components/profile/categoryButton";
import DeleteModal from "@components/profile/deleteModal";
import ClickedProject from "@components/project/clickedProject";
import ProjectDraftItem from "@components/project/projectDraftItem";
import ProjectItem from "@components/project/projectItem";
import NextButton from "@components/upload/nextButton";
import useMutation from "@libs/client/useMutation";
import { ProfileResponse, useUserState } from "@libs/client/useUser";
import {
  cfImageUpload,
  cls,
  makeImageURL,
  timeConverter,
} from "@libs/client/utils";
import {
  CoddinkFollow,
  CoddinkLike,
  CoddinkProject,
  CoddinkUser,
} from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  CommentProps,
  CommentResponse,
  CommentWithUser,
  DetailProjectResponse,
  GETCommentResponse,
  OwnerProps,
  ProjectWithCountWithUser,
} from "pages";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface ProfileWithCount extends CoddinkUser {
  _count: {
    portfolio: number;
    followers: number;
    followings: number;
    like: number;
  };
}

interface ProfileUserInfoResponse {
  ok: boolean;
  userInfo: ProfileWithCount;
}

interface UserProjectsResponse {
  ok: boolean;
  projects: ProjectWithCountWithUser[];
}

interface ProjectWithCount extends CoddinkProject {
  _count: { like: number };
  owner: OwnerProps[];
}

interface LikeProjectWithCountWithUser extends CoddinkLike {
  project: ProjectWithCount;
}

interface LikeProjectResponse {
  ok: boolean;
  projects: LikeProjectWithCountWithUser[];
}

interface ToggleResponse {
  ok: boolean;
}

interface BannerProps {
  imageSrc: string;
  position: string;
}

const Profile: NextPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentProps>();
  const [isTop, setIsTop] = useState(true);
  const [updateProfile, { loading, data: ProfileData }] =
    useMutation<ToggleResponse>("/api/profile");
  const [banner, setBanner] = useState<BannerProps>({
    imageSrc: "",
    position: "",
  });
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const [isBannerOver, setIsBannerOver] = useState(false);
  const [isBannerClick, setIsBannerClick] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const {
    data,
    error,
    mutate: myDataMutate,
  } = useSWR<ProfileResponse>("/api/users/me");
  const router = useRouter();
  const path = router.asPath;
  const isGallery = path.slice(1, 8) === "gallery";

  const isAppreciated = path.slice(-11) === "appreciated";

  const isDraftPath = path.slice(-6) === "drafts";
  const { data: userData, mutate: userMutate } =
    useSWR<ProfileUserInfoResponse | null>(
      router.query.id ? `/api/users/${router.query.id}` : null
    );

  const { data: userProjects, mutate: projectMutate } =
    useSWR<UserProjectsResponse>(
      router.query.id ? `/api/profile/${router.query.id}/projects` : null
    );

  const { data: likeProjects, mutate: likeProjectMutate } =
    useSWR<LikeProjectResponse>(
      isAppreciated ? `/api/profile/${router.query.id}/appreciated` : null
    );

  const { data: draftProjects, mutate: draftMutate } =
    useSWR<UserProjectsResponse>(
      isDraftPath ? `/api/profile/${router.query.id}/drafts` : null
    );

  const [kind, setKind] = useState<
    "projects" | "moodboards" | "appreciated" | "drafts"
  >("projects");

  const [sendView, { loading: viewLoading, data: viewData }] =
    useMutation("/api/projects/view");

  const [sendFollow, { data: followData, loading: followLoading }] =
    useMutation<CommentResponse>("/api/users/follow");

  const onFollowClick = (id: number | undefined) => {
    if (followLoading || !id) return;
    sendFollow({ id: id, myId: data?.profile?.id });
  };

  const onBannerMouseOver = (kind: number) => {
    if (kind === 1) {
      setIsBannerOver(true);
    } else if (kind === 2) {
      setIsBannerOver(false);
    }
  };

  // const onMoodboardClick = () => {
  //   setKind("moodboards");
  //   router.push(
  //     { pathname: "/profile/[id]", query: { id: router.query.id } },
  //     `/profile/${router.query.id}/moodboards`
  //   );
  // };

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

  const onDraftsClick = () => {
    setKind("drafts");
    router.push(
      { pathname: "/profile/[id]", query: { id: router.query.id } },
      `/profile/${router.query.id}/drafts`
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
    sendView({ projectId: id });
    router.push(
      { pathname: "/profile/[id]", query: { id: router.query.id } },
      `/gallery/${id}`
    );
  };

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

  const [deleteProject, { data: deleteData }] = useMutation<CommentResponse>(
    "/api/projects/delete"
  );

  const [commentPage, setCommentPage] = useState(1);

  const { data: getCommentsData, mutate: getCommentsMutate } =
    useSWR<GETCommentResponse | null>(
      isGallery
        ? `/api/projects/${clickedId}/comment?commentIdx=${commentPage}&id=${clickedId}`
        : null
    );

  const [commentArr, setCommentArr] = useState<CommentWithUser[]>([]);

  const onMoreCommentClick = () => {
    setCommentPage((prev) => prev + 1);
    mutate();
  };

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

  const onBannerImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;
    setIsBannerClick(true);
    setIsBannerLoading(true);
    const file = files[0];

    const imageSrc = await cfImageUpload(file);
    setBanner({
      imageSrc,
      position: "object-center",
    });
    setIsBannerLoading(false);
  };

  const imagePotisionClick = (position: number) => {
    if (position === 1) {
      setBanner((prev) => {
        return { ...prev, position: "object-top" };
      });
    } else if (position === 2) {
      setBanner((prev) => {
        return { ...prev, position: "object-center" };
      });
    } else if (position === 3) {
      setBanner((prev) => {
        return { ...prev, position: "object-bottom" };
      });
    }
  };

  const bannerFinishClick = () => {
    if (loading) return;
    setIsBannerClick(false);
    updateProfile({ banner: banner });
  };

  const bannerCancleClick = () => {
    setIsBannerClick(false);
    setBanner({ imageSrc: "", position: "" });
  };

  const bannerResetClick = () => {
    setIsBannerClick(false);
    setBanner({ imageSrc: "", position: "" });
    updateProfile({ banner: { imageSrc: "", position: "" } });
  };

  const onDraftRouterClick = (id: number) => {
    router.push(`/portfolio/editor?project_id=${id}`);
  };

  useEffect(() => {
    if (userData && !userData.ok) {
      router.push("/");
    }
  }, [router, userData]);

  useEffect(() => {
    if (commentData && commentData.ok) {
      reset();
      getCommentsMutate();
    }
  }, [commentData, reset, getCommentsMutate]);

  useEffect(() => {
    if (ProfileData && ProfileData.ok) {
      userMutate();
    }
  }, [ProfileData, userMutate]);

  const handleFollow = () => {
    if (window.scrollY !== 0) {
      setIsTop(false);
    } else {
      setIsTop(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleFollow);

    return () => {
      window.removeEventListener("scroll", handleFollow);
    };
  }, []);

  useEffect(() => {
    if (followData && followData.ok) {
      myDataMutate();
      userMutate();
    }
  }, [followData, myDataMutate, userMutate]);

  useEffect(() => {
    if (deleteData && deleteData.ok) {
      draftMutate();
      projectMutate();
      likeProjectMutate();
    }
  }, [deleteData, draftMutate, projectMutate, likeProjectMutate]);

  useEffect(() => {
    if (getCommentsData && getCommentsData.ok) {
      getCommentsMutate();
      setCommentArr(getCommentsData.comments);
    }
  }, [getCommentsData, getCommentsMutate]);

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
      kind="profile"
      isTop={isTop}
    >
      <HeadMeta></HeadMeta>
      {(loading || isBannerLoading) && (
        <div className="absolute top-0 z-20 flex h-[260px]  w-screen items-center justify-center text-3xl text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-12 w-12 animate-spin"
          >
            <path
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-2 text-2xl">로딩중...</span>
        </div>
      )}
      {!isBannerClick && userData?.userInfo.bannerSrc && (
        <div
          onMouseOver={() => onBannerMouseOver(1)}
          onMouseOut={() => onBannerMouseOver(2)}
          className="absolute top-0  flex h-[260px] w-screen items-end justify-center bg-black pb-14 "
        >
          <Image
            src={makeImageURL(userData.userInfo?.bannerSrc, "banner")}
            alt="bannerr"
            priority={true}
            layout="fill"
            className={cls(
              `${userData.userInfo.bannerPosition}`,
              "object-cover transition-opacity",
              isBannerOver && data?.profile?.id === Number(router?.query?.id)
                ? "opacity-60"
                : ""
            )}
          ></Image>
          {!(isBannerLoading || loading) &&
            isBannerOver &&
            userData.userInfo.id === data?.profile?.id && (
              <div className="z-10 flex flex-col items-center text-white">
                <span className="text-lg font-semibold">배너 이미지 대체</span>
                <span className="text-sm font-semibold">
                  최적 치수 3200 x 410px
                </span>
                <div className="mt-4  flex w-72 justify-center space-x-2">
                  <label
                    htmlFor="bannerChange"
                    className="flex w-full cursor-pointer justify-center rounded-full bg-blue-600 py-1 px-2 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    <span>이미지 바꾸기</span>
                    <input
                      onChange={onBannerImage}
                      id="bannerChange"
                      className="hidden"
                      type="file"
                      accept="image/*"
                      // {...register}
                    />
                  </label>
                  <NextButton
                    onClick={bannerResetClick}
                    color="grayBtn"
                    label="제거"
                  />
                </div>
              </div>
            )}
        </div>
      )}
      {kind === "drafts" && isDelete && (
        <DeleteModal
          title="초안 삭제"
          description="이 초안을 삭제하시겠습니까?"
          onDeleteModalClick={() => onDeleteModalClick(null)}
          onProjectDeleteClick={() => onProjectDeleteClick(deleteTarget)}
        ></DeleteModal>
      )}
      {kind !== "drafts" && isDelete && (
        <DeleteModal
          title="프로젝트 삭제"
          description="이 프로젝트를 삭제하시겠습니까?"
          onDeleteModalClick={() => onDeleteModalClick(null)}
          onProjectDeleteClick={() => onProjectDeleteClick(deleteTarget)}
        ></DeleteModal>
      )}
      {!isBannerClick &&
        !userData?.userInfo.bannerSrc &&
        userData?.userInfo.id === data?.profile?.id && (
          <label
            htmlFor="banner"
            className="absolute top-0  flex h-[260px] w-screen cursor-pointer items-end justify-center bg-stone-500 pb-14"
          >
            <div className="flex flex-col items-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-14 w-14"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-.53 14.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V8.25a.75.75 0 00-1.5 0v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg font-semibold">배너 이미지 추가</span>
              <span className="text-sm font-semibold">
                최적 치수 3200 x 410px
              </span>
            </div>
            <input
              onChange={onBannerImage}
              id="banner"
              className="hidden"
              type="file"
              accept="image/*"
              // {...register}
            />
          </label>
        )}
      {!userData?.userInfo.bannerSrc &&
        userData?.userInfo.id !== data?.profile?.id && (
          <div className="absolute top-0  flex h-[260px] w-screen cursor-pointer items-end justify-center bg-stone-500 pb-14"></div>
        )}
      {isBannerClick && (
        <div className="absolute top-0  flex h-[260px] w-screen cursor-pointer items-end justify-center bg-stone-500">
          <div className="relative bottom-0 h-full w-screen">
            {banner.imageSrc && (
              <Image
                src={makeImageURL(banner.imageSrc, "banner")}
                alt="banner"
                layout="fill"
                className={cls(`${banner.position}`, "object-cover")}
              ></Image>
            )}
          </div>
          <div className="absolute -bottom-20 z-10 flex text-3xl text-black">
            <div className="flex h-20 w-screen items-center justify-center space-x-2 bg-gray-200">
              <div
                onClick={() => imagePotisionClick(1)}
                title="위"
                className="flex cursor-pointer items-center justify-center rounded-md bg-blue-600 px-2 py-1 text-lg text-white"
              >
                top
              </div>
              <div
                onClick={() => imagePotisionClick(2)}
                title="가운데"
                className="flex cursor-pointer items-center justify-center rounded-md bg-blue-600 px-2 py-1 text-lg text-white"
              >
                center
              </div>
              <div
                onClick={() => imagePotisionClick(3)}
                title="아래"
                className="flex cursor-pointer items-center justify-center rounded-md bg-blue-600 px-2 py-1 text-lg text-white"
              >
                bottom
              </div>

              <div className="w-16">
                <NextButton
                  onClick={bannerFinishClick}
                  color="blueDiv"
                  label="완료"
                ></NextButton>
              </div>
              <div className="w-16">
                <NextButton
                  onClick={bannerCancleClick}
                  color="grayBtn"
                  label="취소"
                ></NextButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex px-14 py-14 ">
        <div className="z-10 flex w-1/5 flex-col rounded-sm bg-white p-8 shadow-md">
          <div className="relative mb-6 h-24 w-24 self-center">
            <Image
              className="rounded-full"
              src={makeImageURL(
                userData?.userInfo.avatar ||
                  "8b9dd122-cda2-4183-e41e-2c8d9259ac00",
                "smAvatar"
              )}
              alt="avatar"
              layout="fill"
              priority={true}
            ></Image>
          </div>
          <div className="self-center text-2xl font-semibold">
            {userData?.userInfo?.name}
          </div>
          <div className="mt-3 flex flex-col items-center text-sm text-gray-500">
            <span>{userData?.userInfo.job}</span>
            {userData?.userInfo.URL && (
              <Link href={userData?.userInfo.URL}>
                <a className="cursor-pointer underline">
                  {userData?.userInfo.URL}
                </a>
              </Link>
            )}
            <Link href="search">
              <a className="mt-4 flex cursor-pointer items-center">
                {(userData?.userInfo.city !== null ||
                  userData?.userInfo.country !== null) && (
                  <div className="font-base flex cursor-pointer items-center text-xs text-gray-400 transition-colors hover:text-gray-800 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-1 h-4 w-4 "
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <span>
                      {userData?.userInfo.city &&
                        `${userData?.userInfo.city}, `}
                      {userData?.userInfo.country}
                    </span>
                  </div>
                )}
              </a>
            </Link>
          </div>
          <div className="my-8 w-full space-y-2">
            {userData?.userInfo.id === data?.profile?.id && (
              <Link href={`/profile/${userData?.userInfo?.id}/editor`}>
                <a>
                  <NextButton
                    color="blueDiv"
                    label="내 프로필 편집"
                  ></NextButton>
                </a>
              </Link>
            )}
            {userData?.userInfo.id !== data?.profile?.id && (
              <>
                {data?.profile?.followings?.find(
                  (ele: CoddinkFollow) =>
                    ele.followerId === userData?.userInfo.id
                ) ? (
                  <NextButton
                    onClick={() => onFollowClick(userData?.userInfo.id)}
                    color="followDelBtn"
                    label={"팔로잉"}
                  ></NextButton>
                ) : (
                  <NextButton
                    onClick={() => onFollowClick(userData?.userInfo.id)}
                    color="blueBtn"
                    label={"팔로우"}
                  ></NextButton>
                )}
                {/* <NextButton color="grayBtn" label="메세지"></NextButton> */}
              </>
            )}
          </div>
          <div className="flex w-full items-center justify-between">
            <span>프로젝트 보기</span>
            <span>{userProjects?.projects.length}</span>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <span>평가</span>
            <span>{userData?.userInfo._count.like}</span>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <span>팔로워</span>
            <span>{userData?.userInfo._count.followers}</span>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <span>팔로잉</span>
            <span>{userData?.userInfo._count.followings}</span>
          </div>
          <div className="mt-4 flex flex-col justify-start">
            {(userData?.userInfo.Facebook ||
              userData?.userInfo.Dribble ||
              userData?.userInfo.Github ||
              userData?.userInfo.Instagram ||
              userData?.userInfo.LinkedIn ||
              userData?.userInfo.Twitch ||
              userData?.userInfo.Twitter) && (
              <span className="text-xs font-semibold text-gray-600">웹</span>
            )}
            <div className="mt-3 flex space-x-2">
              {userData?.userInfo.Facebook && (
                <Link
                  href={`https://www.facebook.com/${userData?.userInfo.Facebook}`}
                >
                  <a
                    title="facebook"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
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
              )}
              {userData?.userInfo.Youtube && (
                <Link
                  href={`https://www.youtube.com/${userData?.userInfo.Youtube}`}
                >
                  <a
                    title="youtube"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
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
              )}
              {userData?.userInfo.Github && (
                <Link
                  href={`https://www.github.com/${userData?.userInfo.Github}`}
                >
                  <a
                    target="_blank"
                    title="github"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
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
              )}
              {userData?.userInfo.Twitter && (
                <Link
                  href={`https://twitter.com/${userData?.userInfo.Twitter}`}
                >
                  <a
                    title="twitter"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
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
              )}
              {userData?.userInfo.Instagram && (
                <Link
                  href={`https://www.instagram.com/${userData?.userInfo.Instagram}`}
                >
                  <a
                    title="instagram"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
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
              )}
              {userData?.userInfo.LinkedIn && (
                <Link
                  href={`https://www.linkedin.com/${userData?.userInfo.LinkedIn}`}
                >
                  <a
                    title="linkedin"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
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
              )}
              {userData?.userInfo.Twitch && (
                <Link
                  href={`https://www.twitch.tv/${userData?.userInfo.Twitch}`}
                >
                  <a
                    title="twitch"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
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
              )}
              {userData?.userInfo.Dribble && (
                <Link
                  href={`https://dribbble.com/${userData?.userInfo.Dribble}`}
                >
                  <a
                    title="dribble"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
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
              )}
            </div>
            <div className="mt-4 flex flex-col justify-start">
              {userData?.userInfo.company && (
                <span className="text-xs font-semibold text-gray-600">
                  Team
                </span>
              )}

              <div className="mt-3 flex flex-col text-sm">
                <span className="font-semibold text-gray-800">
                  {userData?.userInfo.company}
                </span>
              </div>
            </div>
            {userData?.userInfo.introduce && (
              <div className="mt-8 flex flex-col justify-start">
                <span className="text-xs font-semibold text-gray-500">
                  ABOUT ME
                </span>
                <div className="mt-4 whitespace-pre-line text-sm text-gray-800">
                  {userData?.userInfo.introduce}
                </div>
              </div>
            )}
          </div>

          {/* <div className="mt-8 rounded-sm border p-3">
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
          </div> */}

          <div className="mt-2 flex w-full items-center justify-center">
            <span className="mt-8 text-xs font-semibold text-gray-600">
              {userData?.userInfo.createdAt &&
                `멤버 가입일: ${timeConverter(userData?.userInfo.createdAt)}`}
            </span>
          </div>
          {/* {userData?.userInfo.id !== data?.profile?.id && (
            <div className="mt-4 flex justify-center space-x-3 text-sm text-gray-400">
              <span className="cursor-pointer transition-colors hover:text-gray-700">
                신고
              </span>
              <span>|</span>
              <span className="cursor-pointer transition-colors hover:text-gray-700">
                차단
              </span>
            </div>
          )} */}
        </div>
        <div className="relative top-48 w-full pl-14 pb-48">
          <div className="w-full">
            <div className="flex space-x-3">
              <CategoryButton
                onClick={onProjectClick}
                label="작업"
                isSame={kind === "projects"}
              />
              <CategoryButton
                onClick={onDraftsClick}
                label="초안"
                isSame={kind === "drafts"}
              />
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
                    projectId={item.id}
                    followingData={data?.profile?.followings}
                    loginId={data?.profile?.id}
                    onFollowClick={onFollowClick}
                    thumbnail={item.thumbnail}
                    key={item.id}
                    title={item.title}
                    likes={item._count.like}
                    visible={item.visible}
                    views={1}
                    owner={item.owner}
                    onClick={() => onBoxClicked(item.id)}
                    onDeleteModalClick={() => onDeleteModalClick(item.id)}
                  />
                ))}
              {kind === "drafts" &&
                draftProjects?.projects?.map((item) => (
                  <ProjectDraftItem
                    followingData={data?.profile?.followings}
                    loginId={data?.profile?.id}
                    onFollowClick={onFollowClick}
                    thumbnail={item.thumbnail}
                    key={item.id}
                    title={item.title}
                    likes={item._count.like}
                    views={1}
                    owner={item.owner}
                    onClick={() => onDraftRouterClick(item.id)}
                    onDeleteModalClick={() => onDeleteModalClick(item.id)}
                  />
                ))}
              {kind === "appreciated" &&
                likeProjects?.projects?.map((item) => (
                  <ProjectItem
                    visible={item.project.visible}
                    projectId={item.id}
                    followingData={data?.profile?.followings}
                    loginId={data?.profile?.id}
                    onFollowClick={onFollowClick}
                    thumbnail={item.project.thumbnail}
                    key={item.id}
                    title={item.project.title}
                    likes={item.project._count.like}
                    views={1}
                    owner={item.project.owner}
                    onClick={() => onBoxClicked(item.id)}
                    onDeleteModalClick={() => onDeleteModalClick(item.id)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
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
    </Layout>
  );
};

export default Profile;
