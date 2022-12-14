import ErrorMessage from "@components/error";
import LoadingSpinner from "@components/loadingSpinner";
import NextButton from "@components/upload/nextButton";
import UploadInput from "@components/upload/uploadInput";
import UploadButton from "@components/uploadButton";
import { cls, makeImageURL } from "@libs/client/utils";
import { CoddinkUser } from "@prisma/client";
import Image from "next/image";
import {
  thumbnailProps,
  UploadProps,
  UserDataProps,
} from "pages/portfolio/editor";
import React from "react";
import {
  DeepRequired,
  FieldErrorsImpl,
  UseFormRegister,
} from "react-hook-form";

interface CreatePortfoiloProps {
  register: UseFormRegister<UploadProps>;
  errors: FieldErrorsImpl<DeepRequired<UploadProps>>;
  onSetting: () => void;
  isVisible: boolean;
  isPublic: boolean;
  onPublicClick: (value: boolean) => void;
  onVisibleClick: () => void;
  onKeyPress: (
    e: React.KeyboardEvent<HTMLInputElement>,
    kind: "tags" | "category" | "tools" | "owner"
  ) => void;
  tagArr: string[];
  categoryArr: string[];
  toolArr: string[];
  deleteContentTags: (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    kind: "tags" | "category" | "tools" | "owner" | string,
    idx: number
  ) => void;
  userData: UserDataProps[] | undefined;
  onUserClick: (e: React.MouseEvent, item: UserDataProps) => void;
  ownerArr: UserDataProps[];
  onThumbnailImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDraftClick: () => void;
  isDraft: boolean;
  isThumbnailLoading: boolean;
  previewThumbnailImg: thumbnailProps | null;
  isSubmitLoading: boolean;
}

export default function CreatePortfolio({
  register,
  errors,
  onSetting,
  isVisible,
  onPublicClick,
  onVisibleClick,
  isPublic,
  onKeyPress,
  tagArr,
  categoryArr,
  deleteContentTags,
  toolArr,
  userData,
  onUserClick,
  ownerArr,
  onThumbnailImage,
  onDraftClick,
  isDraft,
  isThumbnailLoading,
  previewThumbnailImg,
  isSubmitLoading,
}: CreatePortfoiloProps) {
  return (
    <div className="fixed top-0 z-30 flex h-screen w-screen items-center justify-center">
      <div
        className={cls(
          "absolute top-0 z-30 h-screen w-screen bg-black opacity-90 transition-all"
        )}
        onClick={onSetting}
      ></div>
      <div className="z-50 h-[850px] w-1/2 min-w-[900px] rounded-md border bg-white">
        <div className="grid h-fit w-full grid-cols-5 p-8">
          <div className="col-span-2 h-[700px]  rounded-l-md border bg-gray-50 p-8">
            <div className="">
              <span className="mr-2 text-sm font-semibold">???????????? ??????</span>
              <span className="text-sm text-gray-300">(??????)</span>
              <div className="relative m-auto mt-4 flex h-56 items-center justify-center border border-dashed border-gray-300 px-16">
                {isThumbnailLoading && (
                  <>
                    {previewThumbnailImg?.imageSrc && (
                      <Image
                        src={previewThumbnailImg.description}
                        alt="previewThumbnailImage"
                        layout="fill"
                        className="rounded-sm  object-contain p-2"
                      ></Image>
                    )}
                    <LoadingSpinner />
                  </>
                )}

                {!isThumbnailLoading && !previewThumbnailImg ? (
                  <UploadButton
                    onChange={onThumbnailImage}
                    kind="thumbnail"
                  ></UploadButton>
                ) : (
                  !isThumbnailLoading && (
                    <>
                      {previewThumbnailImg?.imageSrc ? (
                        <Image
                          src={makeImageURL(
                            previewThumbnailImg?.imageSrc,
                            "bigAvatar"
                          )}
                          alt="thumbnail"
                          className="rounded-sm object-contain p-2"
                          layout="fill"
                        ></Image>
                      ) : (
                        <Image
                          src={previewThumbnailImg?.description!}
                          alt="thumbnail"
                          className="rounded-sm object-contain p-2"
                          layout="fill"
                        ></Image>
                      )}
                      <div className="absolute -bottom-12 left-2 z-10">
                        <UploadButton
                          onChange={onThumbnailImage}
                          kind="changeThumb"
                        ></UploadButton>
                      </div>
                    </>
                  )
                )}
              </div>
              {errors.thumbnail && (
                <ErrorMessage>{errors.thumbnail.message}</ErrorMessage>
              )}
            </div>
          </div>
          <div className="col-span-3 h-[700px] overflow-y-scroll rounded-r-md border-r border-t border-b bg-white px-6">
            <UploadInput
              label="???????????? ??????"
              name="title"
              type="text"
              subLabel="(??????)"
              placeholder="???????????? ?????? ??????"
              register={register("title", {
                required: "???????????? ????????? ???????????????.",
                minLength: {
                  value: 3,
                  message:
                    "???????????? ????????? ?????? ????????? 3????????? 55??? ???????????? ?????????.",
                },
                maxLength: {
                  value: 55,
                  message:
                    "???????????? ????????? ?????? ????????? 3????????? 55??? ???????????? ?????????.",
                },
              })}
            />
            {errors.title && (
              <ErrorMessage>{errors.title.message}</ErrorMessage>
            )}
            <UploadInput
              label="???????????? ??????"
              name="tags"
              contentArr={tagArr}
              onKeyPress={(e) => onKeyPress(e, "tags")}
              deleteContentTags={deleteContentTags}
              type="text"
              required={false}
              subLabel="(?????? 10???)"
              placeholder="???????????? ??? ??????????????? ?????? ?????? ??? ????????? ?????? 10?????? ???????????? ???????????????."
              register={register("tags")}
            />

            <UploadInput
              label="?????? ???"
              name="tools"
              type="text"
              contentArr={toolArr}
              deleteContentTags={deleteContentTags}
              subLabel="(?????? 10???)"
              onKeyPress={(e) => onKeyPress(e, "tools")}
              required={false}
              placeholder="???????????? ??????????????? ?????? ??????????????? ?????? ????????? ????????????????"
              register={register("tools")}
            />

            <UploadInput
              label="??? ??????????????? ?????? ????????? ?????????????????????????"
              subLabel="(?????? , ?????? 10???, Enter ???????????? ???????????? ??? ????????????)"
              name="category"
              type="text"
              deleteContentTags={deleteContentTags}
              contentArr={categoryArr}
              onKeyPress={(e) => onKeyPress(e, "category")}
              placeholder="EX) ?????????, ?????? , ??????, ??????, ????????????, ?????? , ???????????? ???"
              register={register("category", {
                required:
                  categoryArr.length === 0
                    ? "??? ????????? ?????? ??????????????????."
                    : false,
              })}
            />
            {errors.category && (
              <ErrorMessage>{errors.category.message}</ErrorMessage>
            )}
            <UploadInput
              label="?????? URL"
              name="linkURL"
              type="text"
              placeholder="?????? URL ??????"
              register={register("linkURL", {
                minLength: {
                  value: 3,
                  message:
                    "?????? URL??? ?????? ????????? 3????????? 150??? ???????????? ?????????.",
                },
                maxLength: {
                  value: 150,
                  message:
                    "?????? URL??? ?????? ????????? 3????????? 150??? ???????????? ?????????.",
                },
              })}
            />
            {errors.linkURL && (
              <ErrorMessage>{errors.linkURL.message}</ErrorMessage>
            )}
            <label
              className="relative top-2 z-10 text-xs font-semibold"
              htmlFor="visible"
            >
              ?????????
              <div
                id="visible"
                onClick={onVisibleClick}
                className={cls(
                  isVisible ? "border-blue-600" : "",
                  "mt-2 flex w-48 cursor-pointer items-center justify-between rounded-sm border px-2 py-1 text-sm"
                )}
              >
                <span>{isPublic ? "?????? ?????????" : "?????????"}</span>
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
                    ?????? ?????????
                  </div>
                  <div
                    onClick={() => onPublicClick(false)}
                    className={cls(
                      !isPublic ? "bg-blue-400" : "",
                      "flex w-full cursor-pointer items-center justify-between rounded-sm  bg-white py-1 px-2 text-sm"
                    )}
                  >
                    ?????????
                  </div>
                </div>
              )}
            </label>
            <UploadInput
              label="???????????? ??????"
              name="description"
              type="textarea"
              required={false}
              placeholder="????????? ??????????????? ?????? ????????? ??? ?????? ???????????????."
              register={register("description", {
                minLength: {
                  value: 10,
                  message:
                    "???????????? ????????? ?????? ????????? 10????????? 1000??? ???????????? ?????????.",
                },
                maxLength: {
                  value: 1000,
                  message:
                    "???????????? ????????? ?????? ????????? 10????????? 1000??? ???????????? ?????????.",
                },
              })}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
            <UploadInput
              label="?????? ?????????"
              subLabel="??? ??????????????? ????????? ??? ????????? ????????????????"
              name="owner"
              type="text"
              required={false}
              placeholder="?????? ?????? ????????? ???????????? ?????? ????????? ??????"
              register={register("owner", { required: false })}
              userData={userData}
              onUserClick={onUserClick}
              userArr={ownerArr}
              onKeyPress={(e) => onKeyPress(e, "owner")}
              deleteContentTags={deleteContentTags}
            />
            <div className="h-2 w-full pb-12"></div>
          </div>

          <div className="mt-4 flex w-[900px] justify-end">
            <div className="flex flex-col">
              <div className="flex w-[450px] items-end space-x-4">
                {isDraft || isThumbnailLoading || isSubmitLoading ? (
                  <>
                    <NextButton label="??????" color="disabled" size="sm" />
                    <NextButton
                      label={isDraft ? "?????????" : "???????????? ??????"}
                      color="disabled"
                      size="sm"
                    />
                    <NextButton
                      label={isSubmitLoading ? "?????????" : "??????"}
                      color="disabled"
                      size="sm"
                    />
                  </>
                ) : (
                  <>
                    <NextButton
                      label="??????"
                      size="sm"
                      color="whiteDiv"
                      onClick={onSetting}
                    ></NextButton>
                    <NextButton
                      label="???????????? ??????"
                      size="sm"
                      onClick={onDraftClick}
                      color="blueBtn"
                    ></NextButton>
                    <NextButton
                      size="sm"
                      label="??????"
                      color="greenBtn"
                    ></NextButton>
                  </>
                )}
              </div>
              {errors.content && (
                <ErrorMessage>{errors.content.message}</ErrorMessage>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
