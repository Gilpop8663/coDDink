import Layout from "@components/layout";
import UploadButton from "@components/uploadButton";
import useUser, { useUserState } from "@libs/client/useUser";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import useSWR from "swr";

const Editor: NextPage = () => {
  const { user, isLoading } = useUser();
  const [attatchment, setAttatchment] = useState<string | null>(null);
  const [textId, setTextId] = useState(0);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent: any) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      console.log(result);
      setAttatchment(result);
    };
    reader.readAsDataURL(theFile);
    console.log(reader.result);
  };

  const onClearAttatchment = () => {
    setAttatchment(null);
  };

  const onAddTextArea = () => {
    setTextId((prev) => prev + 1);
  };
  return (
    <Layout isLogin={true} profile={user}>
      <div className="absolute top-0 grid h-screen w-full grid-rows-1 bg-black">
        <div className="row-span-1 mt-16 grid w-full grid-cols-6 grid-rows-1 gap-4 bg-gray-100 p-5">
          <div className="relative col-span-5 flex w-full flex-col items-center justify-center bg-white shadow-lg">
            {!attatchment ? (
              <>
                <h3 className="relative bottom-32 text-2xl text-gray-400">
                  프로젝트를 업로드 해보세요 :
                </h3>
                <div className="absolute flex space-x-5">
                  <UploadButton
                    kind="image"
                    label="이미지"
                    onChange={onFileChange}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </UploadButton>
                  <UploadButton kind="text" label="텍스트">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  </UploadButton>
                  <UploadButton kind="code" label="임베드">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </UploadButton>
                </div>
              </>
            ) : (
              <div>
                <Image
                  src={attatchment}
                  width={50}
                  height={50}
                  alt="image"
                ></Image>
                <button onClick={onClearAttatchment} value="삭제">
                  삭제하기
                </button>
              </div>
            )}
          </div>
          <div className="col-span-1 w-full bg-orange-400">s</div>
        </div>
      </div>
    </Layout>
  );
};

export default Editor;
