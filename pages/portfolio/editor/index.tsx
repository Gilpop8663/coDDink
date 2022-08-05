import Layout from "@components/layout";
import SubUploadButton from "@components/subUploadButton";
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
  const [isSetting, setIsSetting] = useState(false);

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

  const onSetting = () => {
    setIsSetting((prev) => !prev);
  };
  return (
    <Layout isLogin={true} profile={user}>
      <div className="absolute top-0 grid h-screen w-full grid-rows-1 bg-black">
        <div className="row-span-1 mt-16 grid w-full grid-cols-6 grid-rows-1 gap-4 bg-gray-100 p-5">
          <div className="relative col-span-5 flex w-full flex-col items-center justify-center border bg-white shadow-lg">
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
          <div className="col-span-1 w-full">
            <div className="flex flex-col border shadow-md">
              <div className="flex h-8 items-center bg-gray-100 pl-2 text-xs font-semibold text-gray-500">
                콘텐츠 추가
              </div>
              <div className="grid grid-cols-3 place-content-center gap-[1.5px]">
                <SubUploadButton label="이미지">
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
                </SubUploadButton>
                <SubUploadButton label="텍스트">
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
                </SubUploadButton>
                <SubUploadButton label="임베드">
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
                </SubUploadButton>
              </div>
              <div className="flex h-8 items-center bg-gray-100 pl-2 text-xs font-semibold text-gray-500">
                프로젝트 편집
              </div>
              <SubUploadButton label="설정" onClick={onSetting}>
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </SubUploadButton>
            </div>
            <div className="mt-20 border bg-white py-7 px-4 shadow-md">
              <div
                onClick={onSetting}
                className="flex cursor-pointer justify-center rounded-full bg-green-600 py-1 font-semibold text-white transition-colors hover:bg-green-700"
              >
                계속
              </div>
              <div className="mt-2 flex cursor-pointer justify-center rounded-full bg-blue-600 py-1 font-semibold text-white transition-colors hover:bg-blue-700">
                초안으로 저장
              </div>
              <div className="mt-4 flex justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="cursor-pointer text-sm hover:underline">
                  미리보기 확인
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isSetting && (
        <div className="absolute top-0 z-30 flex h-screen w-screen items-center justify-center">
          <div className="absolute h-full w-full bg-black opacity-50"></div>
          <div className="z-50 h-4/5 w-1/2 rounded-md border bg-white">
            <div className="grid h-full w-full grid-cols-5 p-8">
              <div className="col-span-2 rounded-l-md border bg-gray-50 p-8">
                <div>
                  <span className="mr-2 text-sm font-semibold">
                    프로젝트 표지
                  </span>
                  <span className="text-sm text-gray-300">(필수)</span>
                </div>
              </div>
              <div className="col-span-3 rounded-r-md border-r border-t border-b bg-white"></div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Editor;
