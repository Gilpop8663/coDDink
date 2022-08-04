import Link from "next/link";
import React, { useEffect, useState } from "react";
import NATURE_IMAGE from "@public/user-login.jpg";
import Image from "next/image";
import Button from "@components/button";
import GOOGLE_LOGO from "@public/google.svg";
import FACEBOOK_LOGO from "@public/facebook.svg";
import APPLE_LOGO from "@public/apple.png";
import { useForm } from "react-hook-form";
import ErrorMessage from "@components/error";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { create } from "domain";
import { watch } from "fs";
import InputPassword from "@components/inputPassword";
import Input from "@components/input";

interface ILoginProps {
  email: string;
  password: string;
}

interface EmailResult {
  ok: boolean;
  message: string;
  avatar?: string;
}

interface MutationResult {
  ok: boolean;
  message: string;
}

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ILoginProps>();
  const [mailCheck, { loading: mailLoading, data: mailData }] =
    useMutation<EmailResult>("/api/users/emailCheck");
  const [login, { loading, data, error }] =
    useMutation<MutationResult>("/api/users/login");

  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [isWrong, setIsWrong] = useState(false);

  const onValid = (value: ILoginProps) => {
    if (mailLoading) return;
    mailCheck({ email: curEmail });
    if (isCheckingEmail === false) return;
    if (loading) return;
    login(value);

    // console.log(value);
  };

  const curEmail = watch("email");
  const curPassword = watch("password");

  const onOtherIdClick = () => {
    router.reload();
  };

  useEffect(() => {
    if (data?.ok) {
      router.push("/");
    } else {
      setIsWrong(true);
    }
    if (mailData?.ok) {
      console.log(mailData.ok);
      setIsCheckingEmail(true);
    }
  }, [data, router, mailData]);

  useEffect(() => {
    if (isWrong == true) {
      setIsWrong(false);
    }
  }, [curPassword]);

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
          {isCheckingEmail === false ? (
            <>
              <h2 className="text-3xl font-semibold ">로그인</h2>
              <div className="flex items-center pt-6">
                <p className="mr-2 text-sm">신규 사용자이신가요?</p>
                <Link href="/user/create">
                  <p className="cursor-pointer text-sm text-blue-500">
                    계정 만들기
                  </p>
                </Link>
              </div>

              <Input
                label="이메일 주소"
                type="email"
                required
                name="email"
                register={register("email", {
                  required: "이메일 주소를 입력해 주십시오.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "옳지 않은 방식의 이메일입니다",
                  },
                })}
              ></Input>
              {mailData?.ok == false && (
                <ErrorMessage>{mailData?.message}</ErrorMessage>
              )}
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
              <Button kind="blue" value="계속"></Button>
              <div className="relative flex items-center justify-center">
                <div className="mt-10 h-[0.1px] w-full bg-gray-300"></div>
                <div className="absolute top-7 bg-white px-2">또는</div>
              </div>
              <div className="mt-8 flex flex-col space-y-6">
                <div className="flex h-16 w-full cursor-pointer items-center justify-center rounded-full border-2 hover:border-gray-300">
                  <Image
                    src={GOOGLE_LOGO}
                    alt="google"
                    height={16}
                    width={16}
                  ></Image>
                  <span className="ml-4 font-semibold">Google로 계속</span>
                </div>
                <div className="flex h-16 w-full cursor-pointer items-center justify-center rounded-full border-2  hover:border-gray-300">
                  <Image
                    src={FACEBOOK_LOGO}
                    alt="facebook"
                    height={16}
                    width={16}
                  ></Image>
                  <span className="ml-4 font-semibold">Facebook으로 계속</span>
                </div>
                <div className="flex h-16 w-full cursor-pointer items-center justify-center rounded-full bg-black hover:ring-4 hover:ring-gray-300">
                  <Image
                    src={APPLE_LOGO}
                    alt="apple"
                    height={16}
                    width={16}
                  ></Image>
                  <span className="ml-4 font-semibold text-white">
                    Apple로 계속
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="text-3xl font-semibold ">
                암호를 입력해 주십시오.
              </span>
              <div className="mt-8 flex items-center">
                <div className="mr-4 h-16 w-16 rounded-full bg-slate-500">
                  <Image
                    className="rounded-full"
                    src={mailData?.avatar!}
                    alt="avatar"
                    width={500}
                    height={500}
                  ></Image>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs">개인 계정</span>
                  <span className="mt-1 text-sm">{curEmail}</span>
                </div>
              </div>
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
              {isWrong === true && data?.ok === false && (
                <ErrorMessage>{data?.message}</ErrorMessage>
              )}
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
              <Button kind="blue" value="계속"></Button>

              <hr className="mt-12" />
              <span
                onClick={onOtherIdClick}
                className="mt-8 cursor-pointer text-sm text-blue-600"
              >
                다른 계정으로 로그인
              </span>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
