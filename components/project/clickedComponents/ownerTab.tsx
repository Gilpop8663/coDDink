import Image from "next/image";
import Link from "next/link";
import React from "react";

interface OwnerProps {
  userId: number;
  avatar: string;
  owner: string;
}

export default function OwnerTab({ userId, avatar, owner }: OwnerProps) {
  return (
    <div className="flex flex-col border bg-white p-8">
      <span className="text-xs font-semibold">소유자</span>
      <div className="mt-4 flex items-center">
        <Link href={`/profile/${userId}`}>
          <a className=" mr-4 cursor-pointer">
            <Image
              src={avatar}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full"
            ></Image>
          </a>
        </Link>
        <span className="font-semibold">{owner}</span>
      </div>
    </div>
  );
}
