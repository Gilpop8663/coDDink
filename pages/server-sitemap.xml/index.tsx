// pages/sitemap.xml.tsx
import { GetServerSidePropsContext } from "next";
import { getServerSideSitemap } from "next-sitemap"; //(1)
import client from "@libs/server/client";

//(2)

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const projects: any = await client.coddinkProject.findMany({
    select: {
      id: true,
    },
  });

  const users: any = await client.coddinkUser.findMany({
    select: {
      id: true,
    },
  });

  const lastmod = new Date().toISOString();

  //(3), (4)

  const URL = process.env.NEXT_PUBLIC_SITE_URL as string;

  const defaultFields = [
    {
      loc: `${URL}`,
      changefreq: "daily",
      priority: "0.8",
      lastmod,
    },
    {
      loc: `${URL}policies/conditions`,
      changefreq: "daily",
      priority: "0.2",
      lastmod,
    },
    {
      loc: `${URL}policies/privacy`,
      changefreq: "daily",
      priority: "0.2",
      lastmod,
    },
    {
      loc: `${URL}user/login`,
      changefreq: "daily",
      priority: "0.8",
      lastmod,
    },
    {
      loc: `${URL}user/create`,
      changefreq: "daily",
      priority: "0.8",
      lastmod,
    },
  ];

  const projectFields = projects.map((project: any) => ({
    loc: `${URL}gallery/${project.id}`,
    changefreq: "daily",
    priority: "1.0",
    lastmod,
  }));

  const userFields = users.map((user: any) => ({
    loc: `${URL}profile/${user.id}`,
    changefreq: "daily",
    priority: "0.9",
    lastmod,
  }));

  //(6)
  const fields: any = [...defaultFields, ...projectFields, ...userFields];

  //(7)
  return getServerSideSitemap(ctx, fields);
};
//(8)
export default () => {
  return;
};
