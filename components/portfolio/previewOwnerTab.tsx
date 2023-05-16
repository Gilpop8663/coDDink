import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { OwnerProps } from 'pages';
import { UserDataProps } from 'pages/portfolio/editor';
import { makeImageURL } from '@libs/client/utils';

interface OwnerTabProps {
  city?: string | null;
  country?: string | null;
  name: string | null | undefined;
  avatar: string | null | undefined;
}

export default function PreviewOwnerTab({
  country,
  city,
  avatar,
  name,
}: OwnerTabProps) {
  return (
    <div className="flex flex-col border bg-white p-8">
      <span className="text-xs font-semibold">소유자</span>
      <div className="mt-4 flex flex-col justify-center space-y-2">
        <div className="flex items-center">
          <div className="relative mr-2 h-10 w-10 cursor-pointer rounded-full bg-black">
            <Image
              src={makeImageURL(avatar!, 'smAvatar')}
              alt="userAvater"
              layout="fill"
              className=" rounded-full object-cover transition-all hover:opacity-90"></Image>
          </div>
          <div className="flex flex-col justify-center">
            <div className="cursor-pointer hover:underline">{name}</div>

            {(city !== null || country !== null) && (
              <div className="font-base flex cursor-pointer items-center text-xs text-gray-400 transition-colors hover:text-gray-800 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-1 h-4 w-4 ">
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>

                <span>
                  {city && `${city},`}
                  {country}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
