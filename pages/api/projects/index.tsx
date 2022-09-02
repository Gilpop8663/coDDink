import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { ContentProps, UserDataProps } from "pages/portfolio/editor";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const projects = await client.idea_project.findMany({
      include: {
        user: {
          select: {
            avatar: true,
            name: true,
          },
        },
        _count: {
          select: {
            like: true,
            view: true,
          },
        },
        owner: {
          select: {
            name: true,
            userId: true,
            user: {
              select: {
                avatar: true,
                city: true,
                country: true,
              },
            },
          },
        },
      },
    });

    if (projects.length === 0) {
      return res.json({ ok: false, projects: [] });
    }

    res.json({
      ok: true,
      projects,
    });
  }

  if (req.method === "POST") {
    const {
      body: {
        title,
        description,
        category,
        owner,
        tags,
        tools,
        visible,
        thumbnail,
        content,
        tagArr,
        categoryArr,
        toolArr,
        ownerArr,
      },
      session: { user },
    } = req;

    const project = await client.idea_project.create({
      data: {
        title,
        description,
        visible,
        thumbnail,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    content.forEach(async (item: ContentProps) => {
      if (item.description === "") return;
      const projectContent = await client.idea_projectContent.create({
        data: {
          kind: item.kind,
          imageSrc: item.kind === "image" ? item.imageSrc : null,
          content: item.kind !== "image" ? item.description : null,
          fontSize: item.kind !== "image" ? item.fontSize : null,
          alignText: item.kind === "text" ? item.alignText : null,
          language: item.kind === "code" ? item.language : null,
          project: {
            connect: {
              id: project.id,
            },
          },
        },
      });
    });

    tagArr.forEach(async (item: string) => {
      if (item === "" || item.length > 50) return;
      const tagContent = await client.idea_projectTag.create({
        data: {
          name: item,
          project: {
            connect: {
              id: project.id,
            },
          },
        },
      });
    });

    categoryArr.forEach(async (item: string) => {
      if (item === "" || item.length > 50) return;
      const categoryContent = await client.idea_projectCategory.create({
        data: {
          name: item,
          project: {
            connect: {
              id: project.id,
            },
          },
        },
      });
    });

    toolArr.forEach(async (item: string) => {
      if (item === "" || item.length > 50) return;
      const categoryContent = await client.idea_projectTool.create({
        data: {
          name: item,
          project: {
            connect: {
              id: project.id,
            },
          },
        },
      });
    });

    ownerArr.forEach(async (item: UserDataProps) => {
      const categoryContent = await client.idea_projectOwner.create({
        data: {
          name: item.name,
          project: {
            connect: {
              id: project.id,
            },
          },
          user: {
            connect: {
              id: item.id,
            },
          },
        },
      });
    });

    res.json({
      ok: true,
      project,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
