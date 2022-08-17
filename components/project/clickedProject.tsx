import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { idea_comment } from "@prisma/client";
import { useRouter } from "next/router";
import { CommentProps, CommentWithUser } from "pages";
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

interface ItemProps {
  kind: "home" | "gallery";
  title: string;
  id: number;
  likes: number;
  views: number;
  owner: string;
  avatar: string;
  userId: number;
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
}

export default function ClickedProject({
  kind,
  title,
  id,
  likes,
  views,
  owner,
  avatar,
  userId,
  onClick,
  onLikeClick,
  createdAt,
  isLiked,
  commentCount,
  projectComments,
  currentUserId,
  onCommentValid,
  isLogin,
  register,
  handleSubmit,
  errors,
}: ItemProps) {
  const router = useRouter();

  const onBackClick = () => {
    router.back();
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
          className="fixed top-0 left-0 z-20 h-screen w-screen bg-black opacity-90"
          onClick={onBackClick}
        ></div>
      )}
      <div
        className={cls(
          kind === "home" ? "z-20" : "z-0",
          "relative top-5 z-20 flex flex-col"
        )}
      >
        <ClickedHeader
          kind={kind}
          title={title}
          owner={owner}
          avatar={avatar}
          userId={userId}
        ></ClickedHeader>
        <div className="w-[1400px]">
          <div className="h-[1080px] bg-white"></div>
          <ClickedFooter
            onLikeClick={onLikeClick}
            createdAt={createdAt}
            title={title}
            likes={likes}
            views={views}
            comments={commentCount}
            isLiked={isLiked}
          />
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
              <div className="col-span-2">
                <OwnerTab
                  avatar={avatar}
                  userId={userId}
                  owner={owner}
                ></OwnerTab>
                <div className="mt-4 border bg-white p-8">
                  <ClickedInfo
                    kind="sidebar"
                    comments={commentCount}
                    title={title}
                    createdAt={createdAt}
                    likes={likes}
                    views={views}
                  ></ClickedInfo>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
