import ErrorMessage from "@components/error";
import Layout from "@components/layout";
import CreatePortfolio from "@components/portfolio/createPortfolio";
import EditFirstScreen from "@components/portfolio/editFirstScreen";
import EditMenu from "@components/portfolio/editMenu";
import EditSidebar from "@components/portfolio/editSidebar";
import PreviewImage from "@components/portfolio/previewImage";
import PreviewText from "@components/portfolio/previewText";
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
}

interface UploadProjectMutation {
  ok: boolean;
  project: idea_project;
}

export interface ContentProps {
  kind: "image" | "text";
  description: string;
  imageSrc?: string;
  id: string;
  fontSize?: string;
  alignText?: string;
}

interface CFImageResult {
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
    handleSubmit,
    formState: { errors },
  } = useForm<UploadProps>();
  const { user, isLoading } = useUser();
  const [textId, setTextId] = useState(0);
  const [tagArr, setTagArr] = useState<string[]>([]);
  const [ownerArr, setOwnerArr] = useState<UserDataProps[]>([]);
  const [categoryArr, setCategoryArr] = useState<string[]>([]);
  const [toolArr, setToolArr] = useState<string[]>([]);
  const [isSetting, setIsSetting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [content, setContent] = useState<ContentProps[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const [thumbnail, setThumbnail] = useState<thumbnailProps | null>(null);
  const [uploadProjects, { loading, error, data }] =
    useMutation<UploadProjectMutation>("/api/projects");
  const ownerValue = watch("owner");
  const { data: userData, mutate } = useSWR<UserSearchResponse>(
    ownerValue !== "" ? `/api/users/search?name=${ownerValue}` : ""
  );

  const tagValue = watch("tags");
  const categoryValue = watch("category");
  const toolValue = watch("tools");

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
    console.log(content);
    const newValue = {
      ...value,
      content: content,
      visible: true,
      avatar: user?.avatar,
      tagArr: tagArr,
      categoryArr: categoryArr,
      toolArr: toolArr,
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

    const file = files[0];
    console.log(file);

    const imageSrc = await cfImageUpload(file);

    setThumbnail({
      description: URL.createObjectURL(file),
      imageSrc: imageSrc,
    });
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

  const onUserClick = (e: React.MouseEvent, item: UserDataProps) => {
    if (ownerValue === "" || ownerArr.length >= 10) return;
    setOwnerArr((prev) => {
      const newOnwer = [...prev, item];
      return newOnwer;
    });
    setValue("owner", "");
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/gallery/${data?.project.id}`);
    }
  }, [data, router]);

  useEffect(() => {
    document.addEventListener(
      "keydown",
      function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
        }
      },
      true
    );
  }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    console.log(thumbnail);
  }, [thumbnail]);

  // useEffect(() => {
  //   if (images && images.length > 0) {
  //     const n = images.length;
  //     const arr = [];
  //     for (let i = 0; i < n; i++) {
  //       const file = URL.createObjectURL(images[i]);
  //       arr.push({ kind: "image", description: file });
  //     }
  //     const files = arr;
  //     setContent((prev) => {
  //       const newArr = [...prev, ...files];
  //       return newArr;
  //     });
  //   }
  // }, [images]);

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
                />
              ) : (
                <div className=" flex w-full flex-col px-16 py-12">
                  {content &&
                    content.map((item, idx) => (
                      <div
                        key={item.id}
                        className={cls(
                          content.length === 1 ? "h-screen" : "",
                          "w-full"
                        )}
                      >
                        {item.kind === "image" && (
                          <PreviewImage
                            onAddTextArea={onAddTextArea}
                            onPreviewImage={onPreviewImage}
                            src={item.description}
                            idx={idx}
                            onClearClick={onClearAttatchment}
                          />
                        )}
                        {item.kind === "text" && (
                          <PreviewText
                            onAddTextArea={onAddTextArea}
                            onPreviewImage={onPreviewImage}
                            setContent={setContent}
                            idx={idx}
                            textValue={item.description}
                            onChange={(e) => onChange(e, idx)}
                          />
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <EditSidebar
              onPreviewImage={onPreviewImage}
              register={register}
              onSetting={onSetting}
              onAddTextArea={onAddTextArea}
            />
          </div>
        </div>
        {isSetting && (
          <CreatePortfolio
            onThumbnailImage={onThumbnailImage}
            thumbnailSrc={thumbnail?.description}
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
      </form>
    </Layout>
  );
};

export default Editor;
