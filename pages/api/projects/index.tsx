import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { ContentProps, UserDataProps } from "pages/portfolio/editor";
import { idea_project } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { page = 1 },
    } = req;

    const projects = await client.idea_project.findMany({
      where: {
        isDraft: false,
        visible: true,
      },
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
          orderBy: {
            id: "desc",
          },
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
      take: 20,
      skip: +page * 20,
    });

    if (!projects) {
      return res.json({ ok: false, projects: [] });
    }

    return res.json({
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
        isDraft,
        categoryArr,
        toolArr,
        projectId,
        ownerArr,
      },
      session: { user },
    } = req;

    let project: idea_project;
    if (projectId) {
      if (isDraft) {
        project = await client.idea_project.update({
          where: {
            id: Number(projectId),
          },
          data: {
            title: title ? title : "",
            description: description ? description : "",
            visible,
            thumbnail: thumbnail ? thumbnail : "",
            isDraft: isDraft,
            user: {
              connect: {
                id: user?.id,
              },
            },
          },
        });
      } else {
        project = await client.idea_project.update({
          where: {
            id: Number(projectId),
          },
          data: {
            title: title,
            description: description,
            visible,
            thumbnail: thumbnail,
            isDraft: isDraft,
            user: {
              connect: {
                id: user?.id,
              },
            },
          },
        });
      }

      await client.idea_projectContent.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      await client.idea_projectCategory.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      await client.idea_projectOwner.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      await client.idea_projectTag.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      await client.idea_projectTool.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      content.forEach(async (item: ContentProps) => {
        if (item.description === "" || !item.description) return;
        const projectContent = await client.idea_projectContent.create({
          data: {
            kind: item.kind,
            imageSrc: item.kind === "image" ? item.imageSrc : null,
            content: item.kind !== "image" ? item.description : null,
            fontSize: item.kind !== "image" ? item.fontSize : null,
            alignText: item.kind === "text" ? item.alignText : null,
            language: item.kind === "code" ? item.language : null,
            description: item.description,
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
    } else {
      if (isDraft) {
        project = await client.idea_project.create({
          data: {
            title: title ? title : "",
            description: description ? description : "",
            visible,
            thumbnail: thumbnail ? thumbnail : "",
            isDraft: isDraft,
            user: {
              connect: {
                id: user?.id,
              },
            },
          },
        });
      } else {
        project = await client.idea_project.create({
          data: {
            title: title,
            description: description,
            visible,
            thumbnail: thumbnail,
            isDraft: isDraft,
            user: {
              connect: {
                id: user?.id,
              },
            },
          },
        });
      }

      content.forEach(async (item: ContentProps) => {
        if (item.description === "" || !item.description) return;
        const projectContent = await client.idea_projectContent.create({
          data: {
            kind: item.kind,
            imageSrc: item.kind === "image" ? item.imageSrc : null,
            content: item.kind !== "image" ? item.description : null,
            fontSize: item.kind !== "image" ? item.fontSize : null,
            alignText: item.kind === "text" ? item.alignText : null,
            language: item.kind === "code" ? item.language : null,
            description: item.description,
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
    }
    return res.json({
      ok: true,
      project,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
