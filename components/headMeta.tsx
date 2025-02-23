import React from 'react';
import Head from 'next/head';
import { makeImageURL } from '@libs/client/utils';

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
      <title>{title || '코띵크(coDDinK)'}</title>
      <meta
        name="description"
        content={
          description ||
          '코띵크(coDDinK)는 개발자들이 만든 사이드 프로젝트, 사이트 등을 전시하고 검색할 수 있는 무료 온라인 웹 포트폴리오 사이트입니다.'
        }
      ></meta>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title || 'coDDinK'} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || 'https://www.coddink.com/'} />
      <meta
        property="og:image"
        content={image || makeImageURL('ff2afe6b-70f7-4e45-b8b4-59e51ddeea00')}
      />
      <meta
        property="og:description"
        content={
          description ||
          '코띵크(coDDinK)는 개발자들이 만든 사이트 등을 전시하고 검색할 수 있는 무료 온라인 웹 포트폴리오 사이트입니다.'
        }
      ></meta>
      <meta property="og:article:author" content="coDDinK" />
      <meta
        name="naver-site-verification"
        content="c1b1484ecee30f05d1e938d9ee992d6ada1fe55a"
      />
    </Head>
  );
}
