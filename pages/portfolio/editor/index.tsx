import ErrorMessage from "@components/error";
import Layout from "@components/layout";
import CreatePortfolio from "@components/portfolio/createPortfolio";
import EditFirstScreen from "@components/portfolio/editFirstScreen";
import EditMenu from "@components/portfolio/editMenu";
import EditSidebar from "@components/portfolio/editSidebar";
import PreviewCode from "@components/portfolio/previewCode";
import PreviewImage from "@components/portfolio/previewImage";
import PreviewProject from "@components/portfolio/previewProject";
import PreviewText from "@components/portfolio/previewText";
import ClickedProject from "@components/project/clickedProject";
import SubUploadButton from "@components/subUploadButton";
import TextArea from "@components/textArea";
import NextButton from "@components/upload/nextButton";
import UploadInput from "@components/upload/uploadInput";
import UploadButton from "@components/uploadButton";
import useMutation from "@libs/client/useMutation";
import useUser, { useUserState } from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { idea_project, idea_user } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { DetailProjectResponse } from "pages";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

export interface UploadProps {
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
  thumbnail: FileList;
  content: ContentProps[];
}

interface UploadProjectMutation {
  ok: boolean;
  project: idea_project;
}

export interface ContentProps {
  kind: "image" | "text" | "code";
  description: string;
  imageSrc?: string | null;
  id: string;
  fontSize?: string | null;
  alignText?: string | null;
  language?: string | null;
}

export interface CFImageResult {
  result: {
    id: string;
    uploadURL: string;
  };
  result_info: null;
  success: boolean;
  errors: [];
  messages: [];
}

interface UserSearchResponse {
  ok: boolean;
  user: UserDataProps[];
}

export interface UserDataProps {
  id: number;
  name: string;
  avatar: string;
}

interface thumbnailProps {
  description: string;
  imageSrc: string;
}

const Editor: NextPage = () => {
  const router = useRouter();
  const {
    register,
    watch,
    setValue,
    setError,

    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadProps>();
  const { user, isLoading } = useUser();
  const [textId, setTextId] = useState(0);
  const [isDraft, setIsDraft] = useState(false);
  const [tagArr, setTagArr] = useState<string[]>([]);
  const [ownerArr, setOwnerArr] = useState<UserDataProps[]>([]);
  const [categoryArr, setCategoryArr] = useState<string[]>([]);
  const [toolArr, setToolArr] = useState<string[]>([]);
  const [isSetting, setIsSetting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [content, setContent] = useState<ContentProps[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [thumbnail, setThumbnail] = useState<thumbnailProps | null>(null);
  const [uploadProjects, { loading, error, data }] =
    useMutation<UploadProjectMutation>("/api/projects");
  const ownerValue = watch("owner");
  const { project_id } = router.query;

  const { data: editProjectData } = useSWR<DetailProjectResponse | null>(
    project_id ? `/api/projects/${project_id}` : null
  );
  const { data: userData, mutate } = useSWR<UserSearchResponse>(
    ownerValue !== "" ? `/api/users/search?name=${ownerValue}` : ""
  );

  const tagValue = watch("tags");
  const categoryValue = watch("category");
  const toolValue = watch("tools");
  const titleValue = watch("title");
  const descriptionValue = watch("description");

  // const { data: tagData, error: tagError } = useSWR(
  //   `/api/projects/tags?value=${tagValue}`
  // );

  const cfImageUpload = async (file: File) => {
    const { uploadURL } = await (await fetch("/api/files")).json();

    const form = new FormData();
    form.append("file", file);

    const {
      result: { id },
    }: CFImageResult = await (
      await fetch(uploadURL, {
        method: "POST",
        body: form,
      })
    ).json();

    return id;
  };
  const onValid = async (value: UploadProps) => {
    if (loading) return;
    const newValue = {
      ...value,
      content: content,
      visible: isPublic,
      avatar: user?.avatar,
      tagArr: tagArr,
      categoryArr: categoryArr,
      toolArr: toolArr,
      thumbnail: thumbnail?.imageSrc,
      isDraft: isDraft,
      projectId: project_id,
      ownerArr: [
        { name: user?.name, avatar: user?.avatar, id: user?.id },
        ...ownerArr,
      ],
    };

    uploadProjects(newValue);
  };

  const onClearAttatchment = (idx: number) => {
    setContent((prev) => {
      const newArr = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      return newArr;
    });
  };

  const onAddTextArea = (e: React.MouseEvent<HTMLDivElement>, idx?: number) => {
    const newContent: ContentProps = {
      kind: "text",
      description: "",
      id: uuidv4(),
      fontSize: "text-base",
      alignText: "text-left",
    };
    if (!idx && idx !== 0) {
      setContent((prev) => [...prev, newContent]);
    } else {
      if (idx === 0) {
        setContent((prev) => [newContent, ...prev]);
      } else {
        setContent((prev) => [
          ...prev.slice(0, idx),
          newContent,
          ...prev.slice(idx),
        ]);
      }
    }
  };

  const onAddCodeArea = (e: React.MouseEvent<HTMLDivElement>, idx?: number) => {
    const newContent: ContentProps = {
      kind: "code",
      description: "",
      id: uuidv4(),
      language: "jsx",
      fontSize: "text-base",
    };

    if (!idx && idx !== 0) {
      setContent((prev) => [...prev, newContent]);
    } else {
      if (idx === 0) {
        setContent((prev) => [newContent, ...prev]);
      } else {
        setContent((prev) => [
          ...prev.slice(0, idx),
          newContent,
          ...prev.slice(idx),
        ]);
      }
    }
  };

  const onChange = async (e: ChangeEvent<HTMLTextAreaElement>, idx: number) => {
    if (!e.target) return;
    // setCurrentValue(e.target.value);

    setContent((prev) => {
      const curValue = { ...prev[idx], description: e.target.value };

      const newContent = [
        ...prev.slice(0, idx),
        curValue,
        ...prev.slice(idx + 1),
      ];

      return newContent;
    });
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

  const onThumbnailImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;

    setIsThumbnailLoading(true);
    const file = files[0];
    const imageSrc = await cfImageUpload(file);
    setThumbnail({
      description: URL.createObjectURL(file),
      imageSrc: imageSrc,
    });
    setIsThumbnailLoading(false);
  };

  const onPreviewImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    idx?: number
  ) => {
    const {
      target: { files },
    } = e;
    if (!files) return;

    setIsUpload(true);

    const n = files.length;
    const arr: ContentProps[] = [];
    for (let i = 0; i < n; i++) {
      const imageSrc = await cfImageUpload(files[i]);

      arr.push({
        kind: "image",
        description: URL.createObjectURL(files[i]),
        imageSrc: imageSrc,
        id: uuidv4(),
      });
    }

    if (!idx && idx !== 0) {
      setContent((prev) => [...prev, ...arr]);
    } else {
      if (idx === 0) {
        setContent((prev) => [...arr, ...prev]);
      } else {
        setContent((prev) => {
          const newArr = [...prev.slice(0, idx), ...arr, ...prev.slice(idx)];

          return newArr;
        });
      }
    }
    setIsUpload(false);
  };

  const onKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    kind: "tags" | "category" | "tools" | "owner"
  ) => {
    if (e.key === "Enter") {
      if (kind === "tags") {
        if (tagValue === "" || tagArr.length >= 10) return;
        setTagArr((prev) => [...prev, tagValue]);
        setValue("tags", "");
      } else if (kind === "category") {
        if (categoryValue === "" || categoryArr.length >= 10) return;
        setCategoryArr((prev) => [...prev, categoryValue]);
        setValue("category", "");
      } else if (kind === "tools") {
        if (toolValue === "" || toolArr.length >= 10) return;
        setToolArr((prev) => [...prev, toolValue]);
        setValue("tools", "");
      }
    } else if (e.keyCode === 8) {
      if (kind === "tags") {
        if (tagValue !== "") return;
        setTagArr((prev) => [...prev.slice(0, -1)]);
      } else if (kind === "category") {
        if (categoryValue !== "") return;
        setCategoryArr((prev) => [...prev.slice(0, -1)]);
      } else if (kind === "tools") {
        if (toolValue !== "") return;
        setToolArr((prev) => [...prev.slice(0, -1)]);
      } else if (kind === "owner") {
        if (ownerValue !== "") return;
        setOwnerArr((prev) => [...prev.slice(0, -1)]);
      }
    }
  };

  const deleteContentTags = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    kind: "tags" | "category" | "tools" | "owner" | string,
    idx: number
  ) => {
    if (kind === "tags") {
      setTagArr((prev) => {
        let newContent;
        if (idx === 0) {
          newContent = [...prev.slice(idx + 1)];
        } else {
          newContent = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        }
        return newContent;
      });
    } else if (kind === "category") {
      setCategoryArr((prev) => {
        let newContent;
        if (idx === 0) {
          newContent = [...prev.slice(idx + 1)];
        } else {
          newContent = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        }
        return newContent;
      });
    } else if (kind === "tools") {
      setToolArr((prev) => {
        let newContent;
        if (idx === 0) {
          newContent = [...prev.slice(idx + 1)];
        } else {
          newContent = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        }
        return newContent;
      });
    } else if (kind === "owner") {
      setOwnerArr((prev) => {
        let newContent;
        if (idx === 0) {
          newContent = [...prev.slice(idx + 1)];
        } else {
          newContent = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        }
        return newContent;
      });
    }
  };

  const onDraftClick = () => {
    if (isDraft) return;
    setIsDraft(true);
    clearErrors("title");
    clearErrors("thumbnail");
    clearErrors("category");

    const newValue = {
      title: titleValue,
      decription: descriptionValue,
      content: content,
      visible: isPublic,
      avatar: user?.avatar,
      tagArr: tagArr,
      categoryArr: categoryArr,
      toolArr: toolArr,
      thumbnail: thumbnail?.imageSrc,
      isDraft: true,
      projectId: project_id,
      ownerArr: [
        { name: user?.name, avatar: user?.avatar, id: user?.id },
        ...ownerArr,
      ],
    };

    uploadProjects(newValue);
  };

  const onUserClick = (e: React.MouseEvent, item: UserDataProps) => {
    if (ownerValue === "" || ownerArr.length >= 10) return;
    const isOverlap = ownerArr.find((ele) => ele.id === item.id);
    if (isOverlap) return;
    setOwnerArr((prev) => {
      const newOnwer = [...prev, item];
      return newOnwer;
    });
    setValue("owner", "");
  };

  const onPreviewClick = () => {
    setIsPreview((prev) => !prev);
  };

  useEffect(() => {
    if (data?.ok && !isDraft && data.project) {
      router.push(`/gallery/${data?.project.id}`);
    } else if (data?.ok && isDraft && data.project) {
      setIsDraft(false);
      router.replace(
        "/portfolio/editor",
        `/portfolio/editor?project_id=${data.project.id}`,
        { shallow: true }
      );
    }
  }, [data]);

  useEffect(() => {
    document.addEventListener(
      "keydown",
      function (event) {
        if (event.keyCode === 13) {
          if (!event.shiftKey) {
            event.preventDefault();
          }
        }
      },
      true
    );
  }, []);

  useEffect(() => {
    if (!thumbnail) {
      setError("thumbnail", {
        type: "required",
        message: "표지 이미지가 필요합니다.",
      });
    } else {
      clearErrors("thumbnail");
    }
  }, [thumbnail]);

  useEffect(() => {
    if (!content.length) {
      setError("content", {
        type: "required",
        message:
          "프로젝트를 게시하려면 적어도 하나의 콘텐츠를 추가해 주십시오.",
      });
    } else {
      clearErrors("content");
    }
  }, [content]);

  useEffect(() => {
    if (editProjectData?.ok) {
      setCategoryArr(() => {
        const newArr = editProjectData.project.category.map(
          (item) => item.name
        );

        return newArr;
      });

      setValue("title", editProjectData.project.title);
      setValue("description", editProjectData.project.description);

      setContent(() => {
        const newArr = editProjectData.project.contents.map((item) => {
          return {
            alignText: item.alignText,
            language: item.language,
            fontSize: item.fontSize,
            description: item.description,
            imageSrc: item.imageSrc,
            kind: item.kind,
            id: item.id.toString(),
          };
        });

        return newArr;
      });

      setThumbnail({
        description: "",
        imageSrc: editProjectData.project.thumbnail,
      });

      setTagArr(editProjectData.project.tags.map((item) => item.name));
      setToolArr(editProjectData.project.tools.map((item) => item.name));

      setOwnerArr((prev) => {
        const newArr: UserDataProps[] = [];
        editProjectData.project.owner.forEach((item) => {
          if (item.userId === user?.id) return;
          newArr.push({
            name: item.name,
            avatar: item.user.avatar,
            id: item.userId,
          });
        });
        return newArr;
      });

      setIsPublic(editProjectData.project.visible);
    }
  }, [editProjectData]);

  return (
    <Layout isLogin={true} profile={user} userId={user?.id}>
      {isUpload && (
        <div className="fixed z-30 flex h-screen w-screen items-center justify-center bg-black/80 text-3xl text-white">
          이미지 로딩중...
        </div>
      )}
      <form action="" onSubmit={handleSubmit(onValid)}>
        <div className="absolute top-0 grid w-full grid-rows-1 bg-gray-100">
          <div className="row-span-1 mt-16 grid w-full grid-cols-6 grid-rows-1 gap-4 bg-gray-100 p-5">
            <div
              className={cls(
                content.length > 0 ? "" : "h-screen justify-center",
                "relative col-span-5 flex min-h-screen w-full flex-col items-center  border bg-white shadow-lg"
              )}
            >
              {content.length === 0 ? (
                <EditFirstScreen
                  register={register}
                  onPreviewImage={onPreviewImage}
                  onAddTextArea={onAddTextArea}
                  onAddCodeArea={onAddCodeArea}
                />
              ) : (
                <div className=" flex w-full flex-col px-16 py-12">
                  {content &&
                    content.map((item, idx) => (
                      <div
                        key={item.id}
                        className={cls(
                          content.length === 1 ? "" : "",
                          "w-full"
                        )}
                      >
                        {item.kind === "image" && (
                          <PreviewImage
                            onAddTextArea={onAddTextArea}
                            onPreviewImage={onPreviewImage}
                            onAddCodeArea={onAddCodeArea}
                            src={item.description}
                            idx={idx}
                            onClearClick={onClearAttatchment}
                          />
                        )}
                        {item.kind === "text" && (
                          <PreviewText
                            onClearClick={onClearAttatchment}
                            onAddTextArea={onAddTextArea}
                            onPreviewImage={onPreviewImage}
                            onAddCodeArea={onAddCodeArea}
                            setContent={setContent}
                            idx={idx}
                            textValue={item.description}
                            onChange={(e) => onChange(e, idx)}
                          />
                        )}
                        {item.kind === "code" && (
                          <PreviewCode
                            onClearClick={onClearAttatchment}
                            textValue={item.description}
                            onAddTextArea={onAddTextArea}
                            onPreviewImage={onPreviewImage}
                            onAddCodeArea={onAddCodeArea}
                            setContent={setContent}
                            idx={idx}
                            onChange={(e) => onChange(e, idx)}
                          ></PreviewCode>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <EditSidebar
              isDraft={isDraft}
              content={content}
              onPreviewImage={onPreviewImage}
              register={register}
              onSetting={onSetting}
              onAddTextArea={onAddTextArea}
              onAddCodeArea={onAddCodeArea}
              onDraftClick={onDraftClick}
              onPreviewClick={onPreviewClick}
            />
          </div>
        </div>
        {isSetting && (
          <CreatePortfolio
            isThumbnailLoading={isThumbnailLoading}
            isDraft={isDraft}
            onDraftClick={onDraftClick}
            onThumbnailImage={onThumbnailImage}
            thumbnailSrc={thumbnail?.imageSrc}
            onUserClick={onUserClick}
            userData={userData?.user}
            categoryArr={categoryArr}
            toolArr={toolArr}
            tagArr={tagArr}
            onKeyPress={onKeyPress}
            register={register}
            errors={errors}
            isVisible={isVisible}
            isPublic={isPublic}
            onSetting={onSetting}
            onPublicClick={onPublicClick}
            onVisibleClick={onVisibleClick}
            deleteContentTags={deleteContentTags}
            ownerArr={ownerArr}
          />
        )}
        {isPreview && (
          <PreviewProject
            onClick={onPreviewClick}
            loginId={user?.id}
            contents={content}
            title={titleValue}
            likes={0}
            views={0}
            avatar={user?.avatar}
            name={user?.name}
            isLiked={false}
            commentCount={0}
            tools={toolArr}
            category={categoryArr}
            tags={tagArr}
            city={user?.city}
            country={user?.country}
            description={descriptionValue}
          />
        )}
      </form>
    </Layout>
  );
};

export default Editor;
