import useMutation from "@libs/client/useMutation";
import { cls, makeImageURL } from "@libs/client/utils";
import {
  idea_comment,
  idea_project,
  idea_projectCategory,
  idea_projectContent,
  idea_projectTag,
  idea_projectTool,
} from "@prisma/client";
import { useRouter } from "next/router";
import {
  CommentProps,
  CommentWithUser,
  OwnerProps,
  ProjectWithCountWithUser,
} from "pages";
import { useState } from "react";
import {
  DeepRequired,
  FieldErrorsImpl,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import ClickedFooter from "./clickedComponents/clickedFooter";
import ClickedInfo from "./clickedComponents/clickedInfo";
import ClickedHeader from "./clickedComponents/clikcedHeader";
import CommentInput from "./clickedComponents/commentInput";
import OwnerTab from "./clickedComponents/ownerTab";
import CommentMsg from "./clickedComponents/commentMsg";
import ClickedLoginInfo from "./clickedComponents/clickedLoginInfo";
import Image from "next/image";
import ClickedCodeView from "./clickedComponents/clickedCodeView";
import ClickedSideInfos from "./clickedComponents/clickedSideInfos";
import ProjectItem from "./projectItem";
import ClickedRelatedItem from "./clickedComponents/clickedRelatedItem";

interface ItemProps {
  kind: "home" | "gallery";
  title: string;
  id: number;
  likes: number;
  views: number;
  owner: OwnerProps[];
  avatar: string;
  userId: number;
  contents: idea_projectContent[];
  createdAt: Date;
  onLikeClick: () => void;
  onClick?: () => void;
  isLiked: boolean;
  commentCount: number;
  projectComments: CommentWithUser[];
  currentUserId?: number | undefined;
  onCommentValid: (value: CommentProps) => void;
  isLogin: boolean | undefined;
  register: UseFormRegister<CommentProps>;
  handleSubmit: UseFormHandleSubmit<CommentProps>;
  errors: FieldErrorsImpl<DeepRequired<CommentProps>>;
  tools: idea_projectTool[];
  category: idea_projectCategory[];
  tags: idea_projectTag[];
  relatedData: ProjectWithCountWithUser[];
  description: string;
}

export default function ClickedProject({
  kind,
  title,
  id,
  likes,
  views,
  owner,
  avatar,
  onClick,
  onLikeClick,
  createdAt,
  isLiked,
  commentCount,
  projectComments,
  currentUserId,
  onCommentValid,
  tools,
  category,
  tags,
  isLogin,
  register,
  handleSubmit,
  contents,
  relatedData,
  description,
  errors,
}: ItemProps) {
  console.log(contents);
  const router = useRouter();

  const onBackClick = () => {
    router.back();
  };

  const onHomeRelatedClicked = (id: number) => {
    router.push(`/`, `/gallery/${id}`, { shallow: true });
  };

  const onGalleryRelatedClicked = (id: number) => {
    router.push(`/gallery/${id}`);
  };

  return (
    <div
      className={cls(
        kind === "home" ? "absolute left-0 top-0" : "",
        "flex w-screen justify-center"
      )}
    >
      {kind === "home" && (
        <div
          className="fixed top-0 left-0 z-20 h-screen w-screen bg-black/80"
          onClick={onBackClick}
        ></div>
      )}
      <div
        className={cls(
          kind === "home" ? "z-20" : "z-0",
          "relative top-5 z-20 flex flex-col"
        )}
      >
        <ClickedHeader kind={kind} title={title} owner={owner}></ClickedHeader>
        <div className="w-[1400px]">
          <div className="flex flex-col  space-y-8 bg-white px-24 py-16">
            {contents.map((item) => {
              const contentFontSize = item.fontSize;
              return (
                <div
                  key={item.id}
                  className={cls(
                    item.kind === "image" ? "h-screen w-full" : ""
                  )}
                >
                  {item.kind === "image" && (
                    <div className="relative h-5/6 w-full  ">
                      <Image
                        className="object-contain"
                        alt={item.id.toString()}
                        layout="fill"
                        src={makeImageURL(item.imageSrc!, "public")}
                      ></Image>
                    </div>
                  )}
                  {item.kind === "text" && (
                    <div
                      className={cls(
                        `${item?.fontSize} ${item?.alignText}`,
                        "relative whitespace-pre"
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                  {item.kind === "code" && (
                    <ClickedCodeView
                      content={item.content}
                      language={item.language}
                      fontSize={item.fontSize}
                    ></ClickedCodeView>
                  )}
                </div>
              );
            })}
          </div>
          <ClickedFooter
            onLikeClick={onLikeClick}
            createdAt={createdAt}
            title={title}
            likes={likes}
            views={views}
            comments={commentCount}
            isLiked={isLiked}
          />
          <div className="relative grid grid-cols-4 gap-4 bg-[#191919] py-20 px-10">
            {relatedData.map((item, idx) => (
              <ClickedRelatedItem
                onClick={
                  kind === "home"
                    ? () => onHomeRelatedClicked(item.id)
                    : () => onGalleryRelatedClicked(item.id)
                }
                data={item}
                key={item.id}
              />
            ))}
          </div>
          <div className="mb-24 border bg-gray-100 p-24">
            <div className="grid grid-cols-7 gap-7">
              <div className="col-span-5 ">
                {isLogin ? (
                  <form
                    onSubmit={handleSubmit(onCommentValid)}
                    className="flex max-h-52 flex-col border bg-white p-8"
                  >
                    <CommentInput
                      id={id}
                      avatar={avatar}
                      register={register("comment", {
                        required: "이 필드는 반드시 입력해야 합니다.",
                        maxLength: {
                          value: 800,
                          message:
                            "이 필드는 1자리부터 800자리까지 적을 수 있습니다.",
                        },
                      })}
                    ></CommentInput>
                  </form>
                ) : (
                  <ClickedLoginInfo owner={owner} />
                )}

                {projectComments.length > 0 && (
                  <div className="relative bottom-1 flex w-full flex-col space-y-8 border bg-white p-8">
                    {projectComments.map((item) => (
                      <CommentMsg
                        key={item.id}
                        id={item.user.id}
                        avatar={item.user.avatar}
                        name={item.user.name}
                        createdAt={item.createdAt}
                        comment={item.comment}
                        currentUserId={currentUserId}
                      ></CommentMsg>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-span-2 flex flex-col space-y-4">
                <OwnerTab owner={owner}></OwnerTab>
                <div className="mt-4 border bg-white p-8">
                  <ClickedInfo
                    kind="sidebar"
                    comments={commentCount}
                    title={title}
                    createdAt={createdAt}
                    likes={likes}
                    views={views}
                    description={description}
                  ></ClickedInfo>
                </div>
                {tools.length > 0 && (
                  <ClickedSideInfos data={tools} label="툴" />
                )}
                {category.length > 0 && (
                  <ClickedSideInfos data={category} label="크리에이티브 분야" />
                )}
                {tags.length > 0 && (
                  <ClickedSideInfos data={tags} label="태그" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
