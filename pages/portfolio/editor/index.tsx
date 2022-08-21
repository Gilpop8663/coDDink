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
import { idea_project } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

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

interface ContentsProps {}

const Editor: NextPage = () => {
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadProps>();
  const { user, isLoading } = useUser();
  const [textId, setTextId] = useState(0);
  const [isSetting, setIsSetting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [content, setContent] = useState<ContentProps[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const [uploadProjects, { loading, error, data }] =
    useMutation<UploadProjectMutation>("/api/projects");

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
    };

    uploadProjects(newValue);
  };

  const onClearAttatchment = (idx: number) => {
    setContent((prev) => {
      const newArr = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      return newArr;
    });
  };

  const onAddTextArea = (idx?: number) => {
    setContent((prev) => [...prev, { kind: "text", description: "" }]);
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
      });
    }

    console.log(arr);
    if (!idx && idx !== 0) {
      setContent((prev) => [...prev, ...arr]);
    } else {
      if (idx === 0) {
        setContent((prev) => [...arr, ...prev]);
      } else {
        setContent((prev) => [
          ...prev.slice(0, idx),
          ...arr,
          ...prev.slice(idx),
        ]);
      }
    }
    setIsUpload(false);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/gallery/${data?.project.id}`);
    }
  }, [data, router]);

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
                        key={idx}
                        className={cls(
                          content.length === 1 ? "h-screen" : "",
                          "w-full"
                        )}
                      >
                        {item.kind === "image" && (
                          <PreviewImage
                            onPreviewImage={onPreviewImage}
                            src={item.description}
                            idx={idx}
                            onClearClick={onClearAttatchment}
                          />
                        )}
                        {item.kind === "text" && (
                          <PreviewText setContent={setContent} idx={idx} />
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
            register={register}
            errors={errors}
            isVisible={isVisible}
            isPublic={isPublic}
            onSetting={onSetting}
            onPublicClick={onPublicClick}
            onVisibleClick={onVisibleClick}
          />
        )}
      </form>
    </Layout>
  );
};

export default Editor;
