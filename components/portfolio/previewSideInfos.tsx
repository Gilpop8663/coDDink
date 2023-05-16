import React from 'react';
import {
  CoddinkProjectCategory,
  CoddinkProjectTag,
  CoddinkProjectTool,
} from '@prisma/client';

interface SideInfoProps {
  label: string;
  data: string[];
}

export default function PreviewSideInfos({ label, data }: SideInfoProps) {
  return (
    <div className="flex w-full flex-col border bg-white p-8">
      <span className="text-xs font-semibold">{label}</span>
      <div className="mt-4 flex w-full flex-col space-y-2">
        {data.map((item, idx) => (
          <div
            className="flex items-center justify-center rounded-md bg-black/80 p-2 font-semibold text-white"
            key={idx}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
