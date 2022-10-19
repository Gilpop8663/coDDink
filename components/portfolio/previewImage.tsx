import SubUploadButton from "@components/subUploadButton";
import UploadButton from "@components/uploadButton";
import { cls, makeImageURL } from "@libs/client/utils";
import Image from "next/image";
import { ContentProps } from "pages/portfolio/editor";
import React, { useState } from "react";
import EditMenu from "./editMenu";
import MiniUploadMenu from "./miniUploadMenu";

interface PreviewImageProps {
  src: ContentProps;
  idx: number;
  onClearClick: (idx: number) => void;
  onPreviewImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    idx?: number
  ) => void;
  onAddTextArea: (e: React.MouseEvent<HTMLDivElement>, idx?: number) => void;
  onAddCodeArea: (e: React.MouseEvent<HTMLDivElement>, idx?: number) => void;
}

export default function PreviewImage({
  src,
  idx,
  onClearClick,
  onPreviewImage,
  onAddTextArea,
  onAddCodeArea,
}: PreviewImageProps) {
  const [isEditOver, setIsEditOver] = useState(false);

  const onEditHover = () => {
    setIsEditOver((prev) => !prev);
  };
  return (
    <div className="h-full">
      <MiniUploadMenu
        onAddTextArea={onAddTextArea}
        idx={idx}
        onPreviewImage={onPreviewImage}
        onAddCodeArea={onAddCodeArea}
      />

      <div className="relative aspect-video w-full border-blue-600 hover:border">
        <EditMenu
          kind="Image"
          isEditOver={isEditOver}
          onEditHover={onEditHover}
          idx={idx}
          onClearClick={onClearClick}
        />
        {src.imageSrc ? (
          <Image
            src={makeImageURL(src.imageSrc, "public")}
            layout="fill"
            className="object-contain"
            alt="image"
          ></Image>
        ) : (
          <Image
            src={src.description}
            layout="fill"
            className="object-contain"
            alt="image"
          ></Image>
        )}
      </div>
    </div>
  );
}
