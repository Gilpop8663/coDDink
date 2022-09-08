import Head from "next/head";
import React from "react";

interface HeadMetaProps {
  title: string;
  description: string;
  url: string;
  image: string;
}

export default function HeadMeta({
  title,
  description,
  url,
  image,
}: HeadMetaProps) {
  return (
    <Head>
      <title>{title || "천만"}</title>
      <meta
        name="description"
        content={
          description ||
          "사람들의 창조적인 아이디어을 공유하고 발견하기 위한 사이트입니다"
        }
      ></meta>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title || "정리습관"} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || "https://1000-ideas.com/"} />
      <meta property="og:image" content={image} />
      <meta property="og:article:author" content="천만" />
    </Head>
  );
}
