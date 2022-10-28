import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { ContentProps, UserDataProps } from "pages/portfolio/editor";
import { CoddinkProject } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { page = 1 },
    } = req;

    const projects = await client.coddinkProject.findMany({
      where: {
        isDraft: false,
        visible: true,
      },
      orderBy: {
        createdAt: "desc",
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
            ownerIdx: "asc",
          },
          select: {
            name: true,
            userId: true,
            user: {
              select: {
                name: true,
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
        linkURL,
      },
      session: { user },
    } = req;

    if (!user?.id) return;

    let project: CoddinkProject;
    if (projectId) {
      project = await client.coddinkProject.update({
        where: {
          id: Number(projectId),
        },
        data: {
          title: title ? title : "",
          linkURL: linkURL ? linkURL : "",
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

      await client.coddinkProjectContent.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      await client.coddinkProjectCategory.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      await client.coddinkProjectOwner.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      await client.coddinkProjectTag.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      await client.coddinkProjectTool.deleteMany({
        where: {
          projectId: Number(projectId),
        },
      });

      content.forEach(async (item: ContentProps, idx: number) => {
        if (item.description === "" || !item.description) return;
        const projectContent = await client.coddinkProjectContent.create({
          data: {
            kind: item.kind,
            contentIdx: idx,
            imageSrc: item.kind === "image" ? item.imageSrc : null,
            content: item.kind !== "image" ? item.description : null,
            fontSize: item.kind !== "image" ? item.fontSize : null,
            alignText: item.kind === "text" ? item.alignText : null,
            language: item.kind === "code" ? item.language : null,
            description: item.description,
            project: {
              connect: {
                id: Number(projectId),
              },
            },
          },
        });
      });

      tagArr.forEach(async (item: string) => {
        if (item === "" || item.length > 50) return;
        const tagContent = await client.coddinkProjectTag.create({
          data: {
            name: item,
            project: {
              connect: {
                id: Number(projectId),
              },
            },
          },
        });
      });

      categoryArr.forEach(async (item: string) => {
        if (item === "" || item.length > 50) return;
        const categoryContent = await client.coddinkProjectCategory.create({
          data: {
            name: item,
            project: {
              connect: {
                id: Number(projectId),
              },
            },
          },
        });
      });

      toolArr.forEach(async (item: string) => {
        if (item === "" || item.length > 50) return;
        const categoryContent = await client.coddinkProjectTool.create({
          data: {
            name: item,
            project: {
              connect: {
                id: Number(projectId),
              },
            },
          },
        });
      });

      ownerArr.forEach(async (item: UserDataProps, idx: number) => {
        const categoryContent = await client.coddinkProjectOwner.create({
          data: {
            name: item.name,
            ownerIdx: idx,
            project: {
              connect: {
                id: Number(projectId),
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
      project = await client.coddinkProject.create({
        data: {
          title: title ? title : "",
          linkURL: linkURL ? linkURL : "",
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

      content.forEach(async (item: ContentProps, idx: number) => {
        if (item.description === "" || !item.description) return;
        const projectContent = await client.coddinkProjectContent.create({
          data: {
            kind: item.kind,
            contentIdx: idx,
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
        const tagContent = await client.coddinkProjectTag.create({
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
        const categoryContent = await client.coddinkProjectCategory.create({
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
        const categoryContent = await client.coddinkProjectTool.create({
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

      ownerArr.forEach(async (item: UserDataProps, idx: number) => {
        const categoryContent = await client.coddinkProjectOwner.create({
          data: {
            name: item.name,
            ownerIdx: idx,
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

    let isComplete = 1;

    if (isComplete === 1) {
      return res.json({
        ok: true,
        project,
      });
    } else {
      return res.json({
        ok: false,
      });
    }
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler, isPrivate: false })
);
