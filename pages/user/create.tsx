import Layout from "@components/layout";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
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
import FacebookBtn from "@components/auth/facebookBtn";
import Script from "next/script";
import HeadMeta from "@components/headMeta";
import dynamic from "next/dynamic";
import GoogleBtn from "@components/auth/googleBtn";
import { useGoogleLogin } from "@react-oauth/google";
import { SNSMutationResult } from "./login";

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

  const [snsLogin, { data: snsLoginData }] =
    useMutation<SNSMutationResult>("/api/auth/snsLogin");

  const [googleLogin, { data: googleLoginData }] =
    useMutation<SNSMutationResult>("/api/auth/googleLogin");

  const onGoogleLoginClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      googleLogin({ tokenResponse });
    },
  });

  const router = useRouter();

  const onValid = (value: ICreateProps) => {
    if (loading) return;
    create(value);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push("/user/login");
    }
  }, [data, router]);

  useEffect(() => {
    if (snsLoginData && snsLoginData.ok && snsLoginData.kind === "create") {
      router.push("/user/login");
    } else if (
      snsLoginData &&
      snsLoginData.ok &&
      snsLoginData.kind === "login"
    ) {
      router.push("/");
    }
  }, [snsLoginData, router]);

  useEffect(() => {
    if (
      googleLoginData &&
      googleLoginData.ok &&
      googleLoginData.kind === "create"
    ) {
      router.push("/user/login");
    } else if (
      googleLoginData &&
      googleLoginData.ok &&
      googleLoginData.kind === "login"
    ) {
      router.push("/");
    }
  }, [googleLoginData, router]);

  return (
    <div className="">
      <HeadMeta></HeadMeta>

      <div className="fixed -z-10 hidden h-screen w-screen bg-black bg-cover opacity-50 sm:flex"></div>
      <div className="fixed -z-20 hidden h-screen w-screen sm:flex">
        <Image
          alt="background"
          src={NATURE_IMAGE}
          layout="fill"
          objectFit="cover"
        ></Image>
      </div>
      <div className="flex h-screen items-center justify-evenly">
        <div className="hidden text-4xl text-white xl:flex">coDDink</div>
        <form
          onSubmit={handleSubmit(onValid)}
          className="z-10 flex h-full w-screen flex-col  bg-white py-12 px-10 sm:h-fit sm:w-[520px]"
        >
          <span className="mb-4 font-bold">coDDink</span>
          <h2 className="text-3xl font-semibold ">?????? ?????????</h2>
          <div className="flex items-center pt-4">
            <p className="mr-2 text-sm">?????? ????????? ????????????????</p>

            <Link href="/user/login">
              <a className="cursor-pointer text-sm text-blue-600">?????????</a>
            </Link>
          </div>
          <h3 className="pt-6 font-semibold">????????? ??????</h3>
          <div className="flex space-x-5 pt-6 transition-all">
            <div className="rounded-ful flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border bg-white hover:ring-2 hover:ring-gray-300">
              <GoogleBtn
                onGoogleLoginClick={onGoogleLoginClick}
                kind="icon"
              ></GoogleBtn>
            </div>
            <FacebookBtn kind="icon" facebookLogin={snsLogin}></FacebookBtn>

            {/* <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-black hover:ring-4 hover:ring-gray-300">
              <Image
                src={APPLE_LOGO}
                alt="apple"
                height={25}
                width={25}
              ></Image>
            </div> */}
          </div>
          <div className="relative flex items-center justify-center">
            <div className="mt-10 h-[0.1px] w-full bg-gray-300"></div>
            <div className="absolute top-7 bg-white px-2">??????</div>
          </div>
          <div className="flex flex-col pt-6">
            <h3 className="font-semibold">???????????? ??????</h3>
            <Input
              label="????????? ??????"
              type="email"
              required
              name="email"
              placeholder="example@abcdefg.com"
              register={register("email", {
                required: "????????? ????????? ????????? ????????????.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "?????? ?????? ????????? ??????????????????",
                },
              })}
            ></Input>

            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}

            <Input
              label="??????"
              type="text"
              required
              name="name"
              placeholder=""
              register={register("name", {
                required: "????????? ????????? ????????????",
                minLength: {
                  value: 2,
                  message: "?????? ????????????.",
                },
                maxLength: {
                  value: 20,
                  message: "?????? ?????????.",
                },
              })}
            ></Input>

            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            <InputPassword
              label="??????"
              name="password"
              required
              register={register("password", {
                required: "????????? ????????? ????????????.",
                minLength: {
                  value: 8,
                  message: "?????? 8??? ????????? ?????? ???????????? ?????????.",
                },
              })}
            ></InputPassword>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          <span className="pt-4 text-sm font-semibold">?????? ??????</span>
          <div className="flex items-start pt-4">
            <input
              className="h-4 w-4"
              {...register("policy", { required: "????????? ???????????? ?????????." })}
              type="checkbox"
            />
            <span className="ml-2 text-sm">
              ???????????? ??????????????? ?????? ??? ?????? ????????? ?????? ??? ????????? ???????????????.
            </span>
          </div>
          {errors.policy && (
            <ErrorMessage>{errors.policy.message}</ErrorMessage>
          )}

          <div className="ml-2 mt-4 text-sm">
            ????????? ???????????? ??? ??????????????????
            <Link href="/policies/conditions">
              <a target="_blank" className="ml-2 mt-4 text-sm text-blue-600">
                ?????? ??????
              </a>
            </Link>{" "}
            ???
            <Link href="/policies/privacy">
              <a target="_blank" className="ml-2 mt-4 text-sm text-blue-600">
                ?????? ?????? ??????
              </a>
            </Link>
            ??? ???????????? ?????? ??????????????? ???????????????.
          </div>
          <div className="flex self-end pb-8">
            <Button kind="blue" value="?????? ?????????"></Button>
          </div>
        </form>
      </div>
    </div>
  );
}
