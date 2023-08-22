import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { cls } from '@libs/client/utils';

interface SearchBarProps {
  isTop: boolean | undefined;
}

interface SearchProps {
  search: string;
}

export default function SearchBar({ isTop }: SearchBarProps) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SearchProps>();

  const onValid = (value: SearchProps) => {
    router.push(`/search/projects?search=${value.search}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className={cls(
        isTop
          ? 'bg-white/50 text-white focus-within:text-black'
          : 'border  bg-gray-100 text-gray-600',
        'container absolute   right-4 mx-auto flex w-48 items-center rounded-full px-2 py-1 transition-all focus-within:bg-white sm:w-56 md:w-72 lg:left-0 lg:right-0 lg:flex  lg:w-96 lg:py-2  lg:px-3'
      )}
    >
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="mr-2 h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>

      <input
        type="text"
        placeholder="검색..."
        {...register('search')}
        autoComplete="off"
        className={cls(
          isTop
            ? 'bg-white/0 placeholder:text-white focus:text-black focus:placeholder:text-gray-500'
            : 'bg-gray-100',
          'w-full text-sm font-bold outline-none transition-all placeholder:text-sm placeholder:font-normal  focus:bg-white'
        )}
      ></input>
    </form>
  );
}
