import ErrorMessage from "@components/error";
import Layout from "@components/layout";
import SubUploadButton from "@components/subUploadButton";
import NextButton from "@components/upload/nextButton";
import UploadInput from "@components/upload/uploadInput";
import UploadButton from "@components/uploadButton";
import useMutation from "@libs/client/useMutation";
import useUser, { useUserState } from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { idea_project } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface UplaodProps {
  title: string;
  tags: string;
  tools: string;
  category: string;
  visible: boolean;
  description: string;
  owner: string;
}

interface UploadProjectMutation {
  ok: boolean;
  project: idea_project;
}

const Editor: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UplaodProps>();
  const { user, isLoading } = useUser();
  const [attatchment, setAttatchment] = useState<string | null>(null);
  const [textId, setTextId] = useState(0);
  const [isSetting, setIsSetting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [uploadProjects, { loading, error, data }] =
    useMutation<UploadProjectMutation>("/api/projects");

  const onValid = (value: UplaodProps) => {
    if (loading) return;

    uploadProjects({ ...value, visible: isPublic });
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent: any) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      console.log(result);
      setAttatchment(result);
    };
    reader.readAsDataURL(theFile);
    console.log(reader.result);
  };

  const onClearAttatchment = () => {
    setAttatchment(null);
  };

  const onAddTextArea = () => {
    setTextId((prev) => prev + 1);
  };

  const onSetting = () => {
    setIsSetting((prev) => !prev);
  };

  const onVisibleClick = () => {
    setIsVisible((prev) => !prev);
  };

  const onPublicClick = (value: boolean) => {
    setIsPublic(value);
    setIsVisible(false);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/gallery/${data?.project.id}`);
    }
  }, [data, router]);

  return (
    <Layout isLogin={true} profile={user}>
      <form action="" onSubmit={handleSubmit(onValid)}>
        <div className="absolute top-0 grid h-screen w-full grid-rows-1 bg-black">
          <div className="row-span-1 mt-16 grid w-full grid-cols-6 grid-rows-1 gap-4 bg-gray-100 p-5">
            <div className="relative col-span-5 flex w-full flex-col items-center justify-center border bg-white shadow-lg">
              {!attatchment ? (
                <>
                  <h3 className="relative bottom-32 text-2xl text-gray-400">
                    프로젝트를 업로드 해보세요 :
                  </h3>
                  <div className="absolute flex space-x-5">
                    <UploadButton
                      kind="image"
                      label="이미지"
                      onChange={onFileChange}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </UploadButton>
                    <UploadButton kind="text" label="텍스트">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                        />
                      </svg>
                    </UploadButton>
                    <UploadButton kind="code" label="임베드">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </UploadButton>
                  </div>
                </>
              ) : (
                <div>
                  <Image
                    src={attatchment}
                    width={50}
                    height={50}
                    alt="image"
                  ></Image>
                  <button onClick={onClearAttatchment} value="삭제">
                    삭제하기
                  </button>
                </div>
              )}
            </div>
            <div className="col-span-1 w-full">
              <div className="flex flex-col border shadow-md">
                <div className="flex h-8 items-center bg-gray-100 pl-2 text-xs font-semibold text-gray-500">
                  콘텐츠 추가
                </div>
                <div className="grid grid-cols-3 place-content-center gap-[1.5px]">
                  <SubUploadButton label="이미지">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </SubUploadButton>
                  <SubUploadButton label="텍스트">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  </SubUploadButton>
                  <SubUploadButton label="임베드">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </SubUploadButton>
                </div>
                <div className="flex h-8 items-center bg-gray-100 pl-2 text-xs font-semibold text-gray-500">
                  프로젝트 편집
                </div>
                <SubUploadButton label="설정" onClick={onSetting}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </SubUploadButton>
              </div>
              <div className="mt-20 space-y-4 border bg-white py-7 px-4 shadow-md">
                <NextButton color="green" label="계속" onClick={onSetting} />
                <NextButton label="초안으로 저장" color="blue" />
                <div className="mt-4 flex justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="cursor-pointer text-sm hover:underline">
                    미리보기 확인
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isSetting && (
          <div className="absolute top-0 z-30 flex h-screen w-screen items-center justify-center">
            <div
              className={cls(
                "absolute top-0 z-30 h-screen w-screen bg-black opacity-90 transition-all"
              )}
              onClick={onSetting}
            ></div>
            <div className="z-50 h-4/5  w-1/2 min-w-[900px] rounded-md border bg-white">
              <div className="grid h-full w-full grid-cols-5 p-8">
                <div className="col-span-2 rounded-l-md border bg-gray-50 p-8">
                  <div>
                    <span className="mr-2 text-sm font-semibold">
                      프로젝트 표지
                    </span>
                    <span className="text-sm text-gray-300">(필수)</span>
                    <div className="m-auto mt-4 flex h-56 items-center justify-center border border-dashed border-gray-300 px-16">
                      <NextButton color="blue" label="이미지 업로드" />
                    </div>
                  </div>
                </div>
                <div className="col-span-3 rounded-r-md border-r border-t border-b bg-white px-6">
                  <UploadInput
                    label="프로젝트 제목"
                    name="title"
                    type="text"
                    placeholder="프로젝트 제목 입력"
                    register={register("title", {
                      required: "프로젝트 제목이 필요합니다.",
                      minLength: {
                        value: 3,
                        message:
                          "프로젝트 제목의 문자 길이는 3자에서 55자 사이여야 합니다.",
                      },
                      maxLength: {
                        value: 55,
                        message:
                          "프로젝트 제목의 문자 길이는 3자에서 55자 사이여야 합니다.",
                      },
                    })}
                  />
                  {errors.title && (
                    <ErrorMessage>{errors.title.message}</ErrorMessage>
                  )}
                  <UploadInput
                    label="프로젝트 태그"
                    name="tags"
                    type="text"
                    required={false}
                    subLabel="(최대 10개)"
                    placeholder="사람들이 내 프로젝트를 쉽게 찾을 수 있도록 최대 10개의 키워드를 추가하세요."
                    register={register("tags")}
                  />

                  <UploadInput
                    label="사용 툴"
                    name="tools"
                    type="text"
                    required={false}
                    placeholder="사용하신 프레임워크 또는 라이브러리 또는 언어는 무엇입니까?"
                    register={register("tools")}
                  />

                  <UploadInput
                    label="이 프로젝트를 어떤 범주로 분류하시겠습니까?"
                    subLabel="(필수)"
                    name="category"
                    type="text"
                    placeholder="EX) 플랫폼, 판매 , 일상, 홍보, 클론코딩, 게임 , 커뮤니티 등"
                    register={register("category", {
                      required: "이 필드는 필수 입력란입니다.",
                    })}
                  />
                  {errors.category && (
                    <ErrorMessage>{errors.category.message}</ErrorMessage>
                  )}
                  <label
                    className="relative top-2 text-xs font-semibold"
                    htmlFor="visible"
                  >
                    가시성
                    <div
                      id="visible"
                      onClick={onVisibleClick}
                      className={cls(
                        isVisible ? "border-blue-600" : "",
                        "mt-2 flex w-48 cursor-pointer items-center justify-between rounded-sm border px-2 py-1 text-sm"
                      )}
                    >
                      <span>{isPublic ? "모든 사용자" : "비공개"}</span>
                      <span>
                        {!isVisible ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                    {isVisible && (
                      <div className="absolute w-48 rounded-sm border">
                        <div
                          onClick={() => onPublicClick(true)}
                          className={cls(
                            isPublic ? "bg-blue-400" : "",
                            "flex w-full cursor-pointer items-center justify-between rounded-sm  bg-white py-1 px-2 text-sm"
                          )}
                        >
                          모든 사용자
                        </div>
                        <div
                          onClick={() => onPublicClick(false)}
                          className={cls(
                            !isPublic ? "bg-blue-400" : "",
                            "flex w-full cursor-pointer items-center justify-between rounded-sm  bg-white py-1 px-2 text-sm"
                          )}
                        >
                          비공개
                        </div>
                      </div>
                    )}
                  </label>
                  <UploadInput
                    label="프로젝트 설명"
                    name="description"
                    type="textarea"
                    required={false}
                    placeholder="설명이 정확할수록 검색 결과에 더 많이 표시됩니다."
                    register={register("description", {
                      minLength: {
                        value: 10,
                        message:
                          "프로젝트 설명의 문자 길이는 10자에서 1000자 사이여야 합니다.",
                      },
                      maxLength: {
                        value: 1000,
                        message:
                          "프로젝트 설명의 문자 길이는 10자에서 1000자 사이여야 합니다.",
                      },
                    })}
                  />
                  {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                  )}
                  <UploadInput
                    label="공동 소유자"
                    subLabel="이 프로젝트에 도움을 준 사람은 누구입니까?"
                    name="owner"
                    type="text"
                    required={false}
                    placeholder="이름 또는 사용자 이름으로 공동 소유자 추가"
                    register={register("owner", { required: false })}
                  />
                  <div className="mt-12 flex items-end justify-end space-x-4">
                    <NextButton
                      label="취소"
                      color="white"
                      onClick={onSetting}
                    ></NextButton>
                    <NextButton label="초안으로 저장" color="blue"></NextButton>
                    <NextButton label="게시" color="green"></NextButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Layout>
  );
};

export default Editor;
