import ErrorMessage from "@components/error";
import Layout from "@components/layout";
import LoadingSpinner from "@components/loadingSpinner";
import CreatePortfolio from "@components/portfolio/createPortfolio";
import EditFirstScreen from "@components/portfolio/editFirstScreen";
import EditMenu from "@components/portfolio/editMenu";
import EditSidebar from "@components/portfolio/editSidebar";
import PreviewCode from "@components/portfolio/previewCode";
import PreviewImage from "@components/portfolio/previewImage";
import PreviewProject from "@components/portfolio/previewProject";
import PreviewText from "@components/portfolio/previewText";
import DeleteModal from "@components/profile/deleteModal";
import ClickedProject from "@components/project/clickedProject";
import SubUploadButton from "@components/subUploadButton";
import TextArea from "@components/textArea";
import NextButton from "@components/upload/nextButton";
import UploadInput from "@components/upload/uploadInput";
import UploadButton from "@components/uploadButton";
import useMutation from "@libs/client/useMutation";
import useUser, { useUserState } from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { CoddinkProject, CoddinkUser } from "@prisma/client";
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
  linkURL: string;
  thumbnail: FileList;
  content: ContentProps[];
}

interface UploadProjectMutation {
  ok: boolean;
  project: CoddinkProject;
}

export interface ContentProps {
  kind: "image" | "text" | "code";
  description: string;
  imageSrc?: string | null;
  id: string;
  fontSize?: string | null;
  alignText?: string | null;
  language?: string | null;
  fileData?: File;
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

export interface thumbnailProps {
  description: string;
  imageSrc: string;
  fileData?: File;
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
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
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
  const [loadingImg, setLoadingImg] = useState("");
  const [thumbnailLoadingImg, setThumbnailLoadingImg] = useState("");
  const [uploadProjects, { loading, error, data }] =
    useMutation<UploadProjectMutation>("/api/projects");
  const ownerValue = watch("owner");
  // const { project_id } = router.query;

  const portfolioAsPath = router.asPath.split("/portfolio/editor?project_id=");

  const project_id = portfolioAsPath.length > 1 ? portfolioAsPath[1] : "";

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
    if (content.length === 0) {
      return;
    }
    if (!user) return;
    if (categoryArr.length === 0) {
      setError("category", {
        type: "required",
        message:
          "프로젝트를 게시하려면 적어도 하나의 카테고리를 추가해 주십시오.",
      });
      return;
    }

    setIsSubmitLoading(true);
    let thumbnailSrc = "";

    const contentArr = await Promise.all(
      content.map(async (item) => {
        if (item.kind === "image") {
          if (item.fileData && !item.imageSrc) {
            const imageSrc = await cfImageUpload(item.fileData);
            return { ...item, imageSrc };
          } else {
            return item;
          }
        } else {
          return item;
        }
      })
    );

    if (thumbnail && thumbnail.imageSrc) {
      thumbnailSrc = thumbnail.imageSrc;
    } else if (thumbnail && thumbnail.fileData) {
      const imageSrc = await cfImageUpload(thumbnail.fileData);
      thumbnailSrc = imageSrc;
    }

    const newValue = {
      ...value,
      content: contentArr,
      visible: isPublic,
      avatar: user?.avatar,
      tagArr: tagArr,
      categoryArr: categoryArr,
      toolArr: toolArr,
      thumbnail: thumbnailSrc,
      isDraft: isDraft,
      projectId: +project_id,
      ownerArr: [
        { name: user.name, avatar: user.avatar, id: user.id },
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
    setThumbnailLoadingImg(URL.createObjectURL(file));
    // const imageSrc = await cfImageUpload(file);

    setThumbnail({
      description: URL.createObjectURL(file),
      imageSrc: "",
      fileData: file,
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

    // setInputFiles((prev) => prev.concat(Array.from(files)));

    setIsUpload(true);

    const n = files.length;
    const arr: ContentProps[] = [];
    for (let i = 0; i < n; i++) {
      setLoadingImg(URL.createObjectURL(files[i]));
      // const imageSrc = await cfImageUpload(files[i]);

      arr.push({
        kind: "image",
        description: URL.createObjectURL(files[i]),
        imageSrc: "",
        fileData: files[i],
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

  const onDraftClick = async () => {
    if (isDraft) return;
    setIsDraft(true);
    clearErrors("title");
    clearErrors("thumbnail");
    clearErrors("category");

    setIsDraft(true);
    let thumbnailSrc = "";

    const contentArr = await Promise.all(
      content.map(async (item) => {
        if (item.kind === "image") {
          if (item.fileData) {
            const imageSrc = await cfImageUpload(item.fileData);
            return { ...item, imageSrc };
          } else {
            return item;
          }
        } else {
          return item;
        }
      })
    );

    if (thumbnail && thumbnail.imageSrc) {
      thumbnailSrc = thumbnail.imageSrc;
    } else if (thumbnail && thumbnail.fileData) {
      const imageSrc = await cfImageUpload(thumbnail.fileData);
      thumbnailSrc = imageSrc;
    }

    const newValue = {
      title: titleValue,
      decription: descriptionValue,
      content: contentArr,
      visible: isPublic,
      avatar: user?.avatar,
      tagArr: tagArr,
      categoryArr: categoryArr,
      toolArr: toolArr,
      thumbnail: thumbnailSrc,
      isDraft: true,
      projectId: +project_id,
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
    if (data && data.ok && !isDraft && data.project) {
      setTimeout(() => {
        router.push(`/gallery/${data.project.id}`);
      }, 1000);
    } else if (data && data.ok && isDraft && data.project) {
      setIsDraft(false);
      router.replace(
        "/portfolio/editor",
        `/portfolio/editor?project_id=${data.project.id}`,
        { shallow: true }
      );
    }
  }, [data, router]);

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
    if (!thumbnail?.imageSrc && !thumbnail?.fileData) {
      setError("thumbnail", {
        type: "required",
        message: "표지 이미지가 필요합니다.",
      });
    } else {
      clearErrors("thumbnail");
    }
  }, [thumbnail, isDraft]);

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
    console.log(categoryArr.length === 0);
    if (categoryArr.length === 0) {
      setError("category", {
        type: "required",
        message:
          "프로젝트를 게시하려면 적어도 하나의 카테고리를 추가해 주십시오.",
      });
    } else {
      clearErrors("category");
    }
  }, [categoryArr, categoryValue]);

  useEffect(() => {
    if (editProjectData?.ok) {
      setCategoryArr(() => {
        const newArr = editProjectData.project.category.map(
          (item) => item.name
        );

        return newArr;
      });

      setValue("linkURL", editProjectData.project.linkURL);
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

      if (editProjectData.project.thumbnail.length > 0) {
        setThumbnail({
          description: "",
          imageSrc: editProjectData.project.thumbnail,
        });
      }

      setTagArr(editProjectData.project.tags.map((item) => item.name));
      setToolArr(editProjectData.project.tools.map((item) => item.name));

      setOwnerArr((prev) => {
        const newArr: UserDataProps[] = [];
        editProjectData.project.owner.forEach((item) => {
          if (item.userId === user?.id) return;
          newArr.push({
            name: item.user.name,
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
      {isSubmitLoading && (
        <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50 text-3xl font-bold text-white">
          <span className="mr-5">게시물 업로드 중입니다</span>
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {isUpload && (
        <div className="fixed z-30 flex h-screen w-screen items-center justify-center bg-black/80 text-3xl text-white">
          <div className="relative flex h-4/5 w-[1400px] items-center justify-center bg-black">
            <Image
              src={loadingImg}
              alt="loadingImage"
              layout="fill"
              className="opacity-40"
            ></Image>
            <LoadingSpinner></LoadingSpinner>
          </div>
        </div>
      )}
      <div className="fixed z-40 flex h-screen w-screen items-center justify-center bg-white xl:hidden">
        <div role="alert">
          <div className="rounded-t bg-red-500 px-4 py-2 font-bold text-white">
            화면이 너무 작습니다
          </div>
          <div className="rounded-b border border-t-0 border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <p>데스크탑을 이용해주세요</p>
          </div>
        </div>
      </div>
      <form action="" onSubmit={handleSubmit(onValid)}>
        <div
          className={cls(
            isSubmitLoading ? "fixed" : "absolute",
            " top-0 grid w-full grid-rows-1 bg-gray-100"
          )}
        >
          <div className="row-span-1 mt-16 grid w-full grid-rows-1 gap-4 bg-gray-100 p-5 lg:grid-cols-8  2xl:grid-cols-9">
            <div
              className={cls(
                content.length > 0 ? "" : "h-screen justify-center",
                "relative flex min-h-screen w-full flex-col items-center border bg-white shadow-lg  lg:col-span-6 2xl:col-span-7  "
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
                            src={item}
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
            isSubmitLoading={isSubmitLoading}
            isThumbnailLoading={isThumbnailLoading}
            previewThumbnailImg={thumbnail}
            isDraft={isDraft}
            onDraftClick={onDraftClick}
            onThumbnailImage={onThumbnailImage}
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
