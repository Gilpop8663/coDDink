import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGoogleLogin } from '@react-oauth/google';
import useSWR from 'swr';
import { showToast } from '@libs/client/toast';
import useMutation from '@libs/client/useMutation';
import { ProfileResponse } from '@libs/client/useUser';
import { makeImageURL } from '@libs/client/utils';
import FacebookBtn from '@components/auth/facebookBtn';
import GoogleBtn from '@components/auth/googleBtn';
import Button from '@components/common/Button';
import ErrorMessage from '@components/common/ErrorMessage';
import Input from '@components/common/Input';
import InputPassword from '@components/common/InputPassword';
import HeadMeta from '@components/headMeta';
import NATURE_IMAGE from '@public/user-login.jpg';

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

export interface SNSMutationResult {
  ok: boolean;
  message: string;
  kind: 'create' | 'login';
}

export default function Login() {
  const { data: userData, mutate: userMutate } =
    useSWR<ProfileResponse>('/api/users/me');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ILoginProps>();
  const [mailCheck, { loading: mailLoading, data: mailData }] =
    useMutation<EmailResult>('/api/users/emailCheck');
  const [login, { loading, data }] =
    useMutation<MutationResult>('/api/users/login');
  const [snsLogin, { data: snsLoginData }] =
    useMutation<SNSMutationResult>('/api/auth/snsLogin');
  const [googleLogin, { data: googleLoginData }] =
    useMutation<SNSMutationResult>('/api/auth/googleLogin');

  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [isWrong, setIsWrong] = useState(false);

  const onValid = (value: ILoginProps) => {
    if (mailLoading) return;
    mailCheck({ email: curEmail });
    if (isCheckingEmail === false) return;
    if (loading) return;
    login(value);
  };

  const onGoogleLoginClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      googleLogin({ tokenResponse });
    },
  });

  const curEmail = watch('email');
  const curPassword = watch('password');

  const onOtherIdClick = () => {
    router.reload();
  };

  useEffect(() => {
    if (data?.ok) {
      showToast('로그인에 성공했습니다! 🎉', 'success');
      router.push('/');
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
      showToast('로그인에 성공했습니다! 🎉', 'success');

      router.push('/');
    }
  }, [userData, router]);

  useEffect(() => {
    if (snsLoginData && snsLoginData.kind === 'create') {
      router.push('/user/login');
      showToast('회원가입에 성공했습니다! 🎉', 'success');
    } else if (snsLoginData && snsLoginData.kind === 'login') {
      userMutate();
    }
  }, [snsLoginData, router, userMutate]);

  useEffect(() => {
    if (googleLoginData && googleLoginData.kind === 'create') {
      router.push('/user/login');
      showToast('회원가입에 성공했습니다! 🎉', 'success');
    } else if (googleLoginData && googleLoginData.kind === 'login') {
      userMutate();
    }
  }, [googleLoginData, router, userMutate]);

  return (
    <div className="">
      <HeadMeta></HeadMeta>
      <div className="fixed -z-10 h-screen w-screen bg-black bg-cover opacity-50"></div>
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
          className="z-10 flex h-screen w-screen  flex-col bg-white py-12 px-10 sm:h-fit sm:w-[520px]"
        >
          {isCheckingEmail === false ? (
            <>
              <h2 className="text-3xl font-semibold ">로그인</h2>
              <div className="flex items-center pt-6">
                <p className="mr-2 text-sm">신규 사용자이신가요?</p>
                <Link href="/user/create" passHref>
                  <a className="cursor-pointer text-sm text-blue-500">
                    계정 만들기
                  </a>
                </Link>
              </div>
              <Input
                label="이메일 주소"
                type="email"
                required
                name="email"
                register={register('email', {
                  required: '이메일 주소를 입력해 주십시오.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '옳지 않은 방식의 이메일입니다',
                  },
                })}
              ></Input>
              {mailData?.ok == false && (
                <ErrorMessage text={mailData?.message} />
              )}
              {errors.email && <ErrorMessage text={errors.email.message} />}
              <div className="mt-4 w-20 self-end">
                <Button color="blue" text="계속" size="sm" py="2" />
              </div>
              <div className="relative flex items-center justify-center">
                <div className="mt-10 h-[0.1px] w-full bg-gray-300"></div>
                <div className="absolute top-7 bg-white px-2">또는</div>
              </div>
              <div className="mt-8 flex flex-col space-y-6">
                <GoogleBtn
                  kind="text"
                  onGoogleLoginClick={onGoogleLoginClick}
                ></GoogleBtn>
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
                    src={makeImageURL(mailData?.avatar!)}
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
                register={register('password', {
                  required: '암호를 입력해 주십시오.',
                  minLength: {
                    value: 8,
                    message: '최소 8개 이상의 문자 포함해야 합니다.',
                  },
                })}
              />
              {isWrong === true && data?.ok === false && (
                <ErrorMessage text={data?.message} />
              )}
              {errors.password && (
                <ErrorMessage text={errors.password.message} />
              )}
              <div className="mt-4  w-20 self-end">
                <Button color="blue" text="계속" size="sm" py="2" />
              </div>
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
