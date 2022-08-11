import Layout from "@components/layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import NATURE_IMAGE from "@public/user-create.jpg";
import GOOGLE_LOGO from "@public/google.svg";
import FACEBOOK_LOGO from "@public/facebook.svg";
import APPLE_LOGO from "@public/apple.png";
import Link from "next/link";
import Button from "@components/button";
import { useForm } from "react-hook-form";
import { cls } from "@libs/client/utils";
import ErrorMessage from "@components/error";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Input from "@components/input";
import InputPassword from "@components/inputPassword";

interface ICreateProps {
  email: string;
  name: string;
  password: string;
  policy: boolean;
}

interface MutationResult {
  ok: boolean;
  message: string;
}

export default function Create() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ICreateProps>();

  const [create, { loading, data, error }] =
    useMutation<MutationResult>("/api/users/create");

  const router = useRouter();

  const onValid = (value: ICreateProps) => {
    if (loading) return;
    create(value);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push("/");
    }
  }, [data, router]);

  return (
    <div className="">
      <div className="fixed -z-10 h-screen w-screen bg-black bg-cover opacity-50"></div>
      <Image
        className="fixed -z-20"
        alt="background"
        src={NATURE_IMAGE}
        layout="fill"
        objectFit="cover"
      ></Image>
      <div className="flex h-screen items-center justify-evenly">
        <div className="text-4xl text-white">1000 Ideas</div>
        <form
          onSubmit={handleSubmit(onValid)}
          className="z-10 flex h-fit w-1/4 flex-col bg-white py-12 px-10"
        >
          <h2 className="text-3xl font-semibold ">계정 만들기</h2>
          <div className="flex items-center pt-4">
            <p className="mr-2 text-sm">이미 계정이 있으십니까?</p>
            <Link href="/user/login">
              <p className="cursor-pointer text-sm text-blue-600">로그인</p>
            </Link>
          </div>
          <h3 className="pt-6 font-semibold">소셜로 등록</h3>
          <div className="flex space-x-5 pt-6 transition-all">
            <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 hover:border-gray-300">
              <Image
                src={GOOGLE_LOGO}
                alt="google"
                height={30}
                width={30}
              ></Image>
            </div>
            <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full  hover:ring-2 hover:ring-gray-300">
              <Image
                src={FACEBOOK_LOGO}
                alt="facebook"
                height={60}
                width={60}
              ></Image>
            </div>
            <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-black hover:ring-4 hover:ring-gray-300">
              <Image
                src={APPLE_LOGO}
                alt="apple"
                height={25}
                width={25}
              ></Image>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="mt-10 h-[0.1px] w-full bg-gray-300"></div>
            <div className="absolute top-7 bg-white px-2">또는</div>
          </div>
          <div className="flex flex-col pt-6">
            <h3 className="font-semibold">이메일로 등록</h3>
            <Input
              label="이메일 주소"
              type="email"
              required
              name="email"
              placeholder="example@abcdefg.com"
              register={register("email", {
                required: "이메일 주소를 입력해 주십시오.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "옳지 않은 방식의 이메일입니다",
                },
              })}
            ></Input>

            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}

            <Input
              label="이름"
              type="text"
              required
              name="name"
              placeholder=""
              register={register("name", {
                required: "이름을 입력해 주십시오",
                minLength: {
                  value: 2,
                  message: "너무 짧습니다.",
                },
                maxLength: {
                  value: 20,
                  message: "너무 깁니다.",
                },
              })}
            ></Input>

            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            <InputPassword
              label="암호"
              name="password"
              required
              register={register("password", {
                required: "암호를 입력해 주십시오.",
                minLength: {
                  value: 8,
                  message: "최소 8개 이상의 문자 포함해야 합니다.",
                },
              })}
            ></InputPassword>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          <span className="pt-4 text-sm font-semibold">필수 항목</span>
          <div className="flex items-start pt-4">
            <input
              className="h-4 w-4"
              {...register("policy", { required: "정책을 동의해야 합니다." })}
              type="checkbox"
            />
            <span className="ml-2 text-sm">
              개인정보 보호정책에 따라 내 개인 정보를 수집 및 사용에 동의합니다.
            </span>
          </div>
          {errors.policy && (
            <ErrorMessage>{errors.policy.message}</ErrorMessage>
          )}
          <span className="ml-2 mt-4 text-sm">
            “계정 만들기”를 클릭함으로써 사용 약관 및 개인정보보호 정책을
            읽었으며 이에 동의한다고 확인합니다.
          </span>
          <Button kind="blue" value="계정 만들기"></Button>
        </form>
      </div>
    </div>
  );
}
