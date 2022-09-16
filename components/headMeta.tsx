import Head from "next/head";
import React from "react";

interface HeadMetaProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

export default function HeadMeta({
  title,
  description,
  url,
  image,
}: HeadMetaProps) {
  return (
    <Head>
      <title>{title || "coDinK"}</title>
      <meta
        name="description"
        content={
          description ||
          "코딩크(CODINK)는 개발자들이 만든 사이트 등을 전시하고 검색할 수 있는 무료 온라인 웹 포트폴리오 사이트입니다."
        }
      ></meta>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title || "coDinK"} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || "https://1000-ideas.com/"} />
      <meta property="og:image" content={image} />
      <meta property="og:article:author" content="coDinK" />
    </Head>
  );
}
