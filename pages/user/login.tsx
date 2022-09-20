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
import InputPassword from "@components/inputPassword";
import Input from "@components/input";
import { makeImageURL } from "@libs/client/utils";
import GoogleBtn from "@components/auth/googleBtn";
import Script from "next/script";
import HeadMeta from "@components/headMeta";
import { ProfileResponse } from "@libs/client/useUser";
import useSWR from "swr";
import FacebookBtn from "@components/auth/facebookBtn";

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
  const {
    data: userData,
    error: userError,
    mutate: userMutate,
  } = useSWR<ProfileResponse>("/api/users/me");
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
  const [snsLogin, { data: snsLoginData }] =
    useMutation<MutationResult>("/api/auth/snsLogin");

  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [isWrong, setIsWrong] = useState(false);

  const onValid = (value: ILoginProps) => {
    if (mailLoading) return;
    mailCheck({ email: curEmail });
    if (isCheckingEmail === false) return;
    if (loading) return;
    login(value);
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
      setIsCheckingEmail(true);
    }
  }, [data, router, mailData]);

  useEffect(() => {
    if (isWrong == true) {
      setIsWrong(false);
    }
  }, [curPassword]);

  useEffect(() => {
    if (userData && userData.ok) {
      router.push("/");
    }
  }, [userData, router]);

  useEffect(() => {
    if (snsLoginData && snsLoginData.ok) {
      router.push("/");
    }
  }, [snsLoginData, router]);

  return (
    <div className="">
      <HeadMeta></HeadMeta>
      <Script
        id="googleScript"
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
      ></Script>
      <Script
        id="my-script"
        strategy="lazyOnload"
      >{`console.log('Hello world!');

        function parseJwt (token) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          return JSON.parse(jsonPayload);
        };

        function handleCredentialResponse(response) {
          // decodeJwtResponse() is a custom function defined by you
          // to decode the credential response.
       
           const responsePayload = parseJwt(response.credential);


          fetch("/api/auth/snsLogin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loginId: responsePayload.sub,
              fullName:responsePayload.name,
              givenName:responsePayload.given_name,
              familyName:responsePayload.family_name,
              imageURL:responsePayload.picture,
              email:responsePayload.email
            }),
          }).then((response) => {console.log(response)
            window.location.replace("/");
          });
       }
      `}</Script>

      <div className="fixed -z-10 h-screen w-screen bg-black bg-cover opacity-50"></div>
      <div className="fixed -z-20 h-screen w-screen">
        <Image
          alt="background"
          src={NATURE_IMAGE}
          layout="fill"
          objectFit="cover"
        ></Image>
      </div>
      <div className="flex h-screen items-center justify-evenly">
        <div className="text-4xl text-white">coDDink</div>
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
                <GoogleBtn kind="text"></GoogleBtn>
                <FacebookBtn kind="text" facebookLogin={snsLogin}></FacebookBtn>
                {/* <div className="flex h-16 w-full cursor-pointer items-center justify-center rounded-full bg-black hover:ring-4 hover:ring-gray-300">
                  <Image
                    src={APPLE_LOGO}
                    alt="apple"
                    height={16}
                    width={16}
                  ></Image>
                  <span className="ml-4 font-semibold text-white">
                    Apple로 계속
                  </span>
                </div> */}
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
                    src={makeImageURL(mailData?.avatar!, "bigAvatar")}
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
