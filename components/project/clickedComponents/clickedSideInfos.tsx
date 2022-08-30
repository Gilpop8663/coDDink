import {
  idea_projectCategory,
  idea_projectTag,
  idea_projectTool,
} from "@prisma/client";
import React from "react";

interface SideInfoProps {
  label: string;
  data: idea_projectCategory[] | idea_projectTag[] | idea_projectTool[];
}

export default function ClickedSideInfos({ label, data }: SideInfoProps) {
  return (
    <div className="flex w-full flex-col border bg-white p-8">
      <span className="text-xs font-semibold">{label}</span>
      <div className="mt-4 flex w-full flex-col space-y-2">
        {data.map((item) => (
          <div
            className="flex items-center justify-center rounded-md bg-black/80 p-2 font-semibold text-white"
            key={item.id}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
