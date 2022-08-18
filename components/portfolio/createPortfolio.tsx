import ErrorMessage from "@components/error";
import NextButton from "@components/upload/nextButton";
import UploadInput from "@components/upload/uploadInput";
import { cls } from "@libs/client/utils";
import { UploadProps } from "pages/portfolio/editor";
import React from "react";
import { FieldErrorsImpl, UseFormRegister } from "react-hook-form";

interface CreatePortfoiloProps {
  register: UseFormRegister<UploadProps>;
  errors: FieldErrorsImpl<{
    title: string;
    tags: string;
    tools: string;
    category: string;
    visible: boolean;
    description: string;
    owner: string;
    images: FileList;
    posts: string[];
    code: string;
  }>;
  onSetting: () => void;
  isVisible: boolean;
  isPublic: boolean;
  onPublicClick: (value: boolean) => void;
  onVisibleClick: () => void;
}

export default function CreatePortfolio({
  register,
  errors,
  onSetting,
  isVisible,
  onPublicClick,
  onVisibleClick,
  isPublic,
}: CreatePortfoiloProps) {
  return (
    <div className="fixed top-0 z-30 flex h-screen w-screen items-center justify-center">
      <div
        className={cls(
          "absolute top-0 z-30 h-screen w-screen bg-black opacity-90 transition-all"
        )}
        onClick={onSetting}
      ></div>
      <div className="z-50  w-1/2 min-w-[900px] rounded-md border bg-white">
        <div className="grid h-full w-full grid-cols-5 p-8">
          <div className="col-span-2 rounded-l-md border bg-gray-50 p-8">
            <div>
              <span className="mr-2 text-sm font-semibold">프로젝트 표지</span>
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
            <div className="my-12 flex items-end justify-end space-x-4">
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
  );
}
