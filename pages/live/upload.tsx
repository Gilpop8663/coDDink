import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import useUser, { useUserState } from "@libs/client/useUser";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface FormProps {
  title: string;
  description: string;
  tools: string;
}

const LiveUpload: NextPage = () => {
  const { user, isLoading } = useUser();
  const { register, handleSubmit } = useForm<FormProps>();
  const [createStream, { loading, data, error }] = useMutation("/api/streams");
  const onValid = (value: FormProps) => {
    if (loading) return;
    createStream(value);
  };

  return (
    <Layout isLogin={true} profile={user} userId={user?.id}>
      <form onSubmit={handleSubmit(onValid)} className="px-16 pt-4">
        <Input
          register={register("title")}
          label="제목"
          name="title"
          type="text"
        ></Input>
        <Input
          register={register("tools")}
          label="도구"
          name="tools"
          type="text"
        ></Input>
        <Input
          register={register("description")}
          label="설명"
          name="description"
          type="text"
        ></Input>
        <Button kind="blue" value="만들기"></Button>
      </form>
    </Layout>
  );
};

export default LiveUpload;
