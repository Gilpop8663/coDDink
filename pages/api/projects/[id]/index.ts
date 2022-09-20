import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const project = await client.idea_project.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      _count: {
        select: {
          like: true,
          comments: true,
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
      user: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
      contents: {
        orderBy: {
          id: "desc",
        },
      },

      tools: true,
      tags: true,
      category: true,
    },
  });
  const relatedProjects = await client.idea_project.findMany({
    where: {
      userId: project?.userId,
      isDraft: false,
      visible: true,
      AND: {
        id: {
          not: project?.id,
        },
      },
    },
    take: 4,
    include: {
      _count: {
        select: {
          like: true,
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
  });

  const isLiked = Boolean(
    await client.idea_like.findFirst({
      where: {
        projectId: Number(id),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  if (
    (project?.isDraft == true || project?.visible === false) &&
    id !== user?.id
  ) {
    return res.json({ ok: false });
  }

  return res.json({
    ok: true,
    project,
    relatedProjects,
    isLiked,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
