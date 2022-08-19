import ErrorMessage from "@components/error";
import Layout from "@components/layout";
import CreatePortfolio from "@components/portfolio/createPortfolio";
import EditFirstScreen from "@components/portfolio/editFirstScreen";
import EditSidebar from "@components/portfolio/editSidebar";
import PreviewImage from "@components/portfolio/previewImage";
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

interface ContentProps {
  kind: "image" | "text" | string;
  description: string;
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
  const [uploadProjects, { loading, error, data }] =
    useMutation<UploadProjectMutation>("/api/projects");

  const onValid = (value: UploadProps) => {
    if (loading) return;
    console.log(value.images);
    return;

    uploadProjects({ ...value, visible: isPublic });
  };

  const images = watch("images");

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

  const onPreviewImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx?: number
  ) => {
    const {
      target: { files },
    } = e;
    if (!files) return;

    const n = files.length;
    const arr: ContentProps[] = [];
    for (let i = 0; i < n; i++) {
      arr.push({ kind: "image", description: URL.createObjectURL(files[i]) });
    }

    console.log(idx);
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
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/gallery/${data?.project.id}`);
    }
  }, [data, router]);

  useEffect(() => {
    if (images && images.length > 0) {
      const n = images.length;
      const arr = [];
      for (let i = 0; i < n; i++) {
        const file = URL.createObjectURL(images[i]);
        arr.push({ kind: "image", description: file });
      }
      const files = arr;
      setContent((prev) => {
        const newArr = [...prev, ...files];
        return newArr;
      });
    }
  }, [images]);

  return (
    <Layout isLogin={true} profile={user} userId={user?.id}>
      <form action="" onSubmit={handleSubmit(onValid)}>
        <div className="absolute top-0 grid w-full grid-rows-1 bg-gray-100">
          <div className="row-span-1 mt-16 grid w-full grid-cols-6 grid-rows-1 gap-4 bg-gray-100 p-5">
            <div
              className={cls(
                content.length > 0 ? "" : "h-screen",
                "relative col-span-5 flex w-full flex-col items-center justify-center border bg-white shadow-lg"
              )}
            >
              {content.length === 0 ? (
                <EditFirstScreen
                  register={register}
                  onPreviewImage={onPreviewImage}
                  onAddTextArea={onAddTextArea}
                />
              ) : (
                <div className=" flex w-full flex-col space-y-9 px-16 py-12">
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
                        {item.kind === "text" && <TextArea kind="upload" />}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <EditSidebar
              onPreviewImage={onPreviewImage}
              register={register}
              onSetting={onSetting}
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
