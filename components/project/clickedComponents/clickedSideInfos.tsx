import React from 'react';
import {
  CoddinkProjectCategory,
  CoddinkProjectTag,
  CoddinkProjectTool,
} from '@prisma/client';

interface SideInfoProps {
  label: string;
  data: CoddinkProjectCategory[] | CoddinkProjectTag[] | CoddinkProjectTool[];
}

export default function ClickedSideInfos({ label, data }: SideInfoProps) {
  return (
    <div className="flex w-full flex-col border bg-white p-8">
      <span className="text-xs font-semibold">{label}</span>
      <div className="mt-4 flex w-full flex-col space-y-2">
        {data.map(item => (
          <div
            className="flex items-center justify-center rounded-md bg-black/80 p-2 font-semibold text-white"
            key={item.id}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
