import ClickedCodeView from "@components/project/clickedComponents/clickedCodeView";
import ClickedFooter from "@components/project/clickedComponents/clickedFooter";
import ClickedInfo from "@components/project/clickedComponents/clickedInfo";
import { cls, makeImageURL } from "@libs/client/utils";
import { CoddinkFollow } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { ContentProps, UserDataProps } from "pages/portfolio/editor";
import PreviewCommentInput from "./previewCommentInput";
import PreviewFooter from "./previewFooter";
import PreviewHeader from "./previewHeader";
import PreviewOwnerTab from "./previewOwnerTab";
import PreviewSideInfos from "./previewSideInfos";

interface ItemProps {
  title: string;
  likes: number;
  views: number;
  avatar: string | null | undefined;
  contents: ContentProps[];
  isLiked: boolean;
  commentCount: number;
  tools: string[];
  category: string[];
  tags: string[];
  description: string;
  loginId: number | undefined;
  city?: string | null;
  country?: string | null;
  name: string | null | undefined;
  onClick: () => void;
}

export default function PreviewProject({
  title,
  onClick,
  likes,
  views,
  avatar,
  isLiked,
  commentCount,
  tools,
  category,
  tags,
  contents,
  description,
  loginId,
  city,
  country,
  name,
}: ItemProps) {
  return (
    <div
      className={cls("absolute left-0 top-0", "flex w-screen justify-center")}
    >
      <div
        className="fixed top-0 left-0 z-20 h-screen w-screen bg-black/80"
        onClick={onClick}
      ></div>

      <div className={cls("z-20", "relative top-5 z-20 flex flex-col")}>
        <PreviewHeader
          title={title}
          name={name}
          avatar={avatar}
        ></PreviewHeader>
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
                      {item.description}
                    </div>
                  )}
                  {item.kind === "code" && (
                    <ClickedCodeView
                      content={item.description}
                      language={item.language!}
                      fontSize={item.fontSize!}
                    ></ClickedCodeView>
                  )}
                </div>
              );
            })}
          </div>
          <PreviewFooter
            createdAt={new Date(Date.now())}
            title={title}
            likes={likes}
            views={views}
            comments={commentCount}
            isLiked={isLiked}
          />

          <div className="mb-24 border bg-gray-100 p-24">
            <div className="grid grid-cols-7 gap-7">
              <div className="col-span-5 ">
                <form className="flex max-h-52 select-none flex-col border bg-white p-8">
                  <PreviewCommentInput avatar={avatar!}></PreviewCommentInput>
                </form>
              </div>
              <div className="col-span-2 flex flex-col space-y-4">
                <PreviewOwnerTab
                  city={city}
                  country={country}
                  name={name}
                  avatar={avatar}
                ></PreviewOwnerTab>
                <div className="mt-4 border bg-white p-8">
                  <ClickedInfo
                    kind="sidebar"
                    comments={commentCount}
                    title={title}
                    createdAt={new Date(Date.now())}
                    likes={likes}
                    views={views}
                    description={description}
                  ></ClickedInfo>
                </div>
                {tools.length > 0 && (
                  <PreviewSideInfos data={tools} label="툴" />
                )}
                {category.length > 0 && (
                  <PreviewSideInfos data={category} label="크리에이티브 분야" />
                )}
                {tags.length > 0 && (
                  <PreviewSideInfos data={tags} label="태그" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
