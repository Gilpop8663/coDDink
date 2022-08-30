import { makeImageURL } from "@libs/client/utils";
import Image from "next/image";
import Link from "next/link";
import { OwnerProps } from "pages";
import React from "react";

interface OwnerTabProps {
  owner: OwnerProps[];
}

export default function OwnerTab({ owner }: OwnerTabProps) {
  return (
    <div className="flex flex-col border bg-white p-8">
      <span className="text-xs font-semibold">소유자</span>
      <div className="mt-4 flex flex-col justify-center space-y-2">
        {owner.map((item, idx) => (
          <div key={idx} className="flex items-center">
            <Link href={`/profile/${item.userId}`}>
              <a className="relative mr-2 h-10 w-10 cursor-pointer rounded-full bg-black">
                <Image
                  src={makeImageURL(item.user.avatar, "smAvatar")}
                  alt="userAvater"
                  layout="fill"
                  className=" rounded-full object-cover transition-all hover:opacity-90"
                ></Image>
              </a>
            </Link>
            <div className="flex flex-col justify-center">
              <Link href={`/profile/${item.userId}`}>
                <a className="cursor-pointer hover:underline">{item.name}</a>
              </Link>
              {(item.user.city !== null || item.user.country !== null) && (
                <div className="font-base flex cursor-pointer items-center text-xs text-gray-400 transition-colors hover:text-gray-800 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1 h-4 w-4 "
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span>
                    {item.user.city && `${item.user.city},`}
                    {item.user.country}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
