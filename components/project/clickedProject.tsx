import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ItemProps {
  title: string;
  id: number;
  likes: number;
  views: number;
  owner: string;
  avatar: string;
  userId: number;
  onClick: () => void;
}

export default function ClickedProject({
  title,
  id,
  likes,
  views,
  owner,
  avatar,
  userId,
  onClick,
}: ItemProps) {
  return (
    <div>
      <div className="fixed top-0 h-screen w-screen"></div>
    </div>
  );
}
