import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const project = await client.coddinkProject.findUnique({
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
          ownerIdx: 'asc',
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
      user: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
      contents: {
        orderBy: {
          contentIdx: 'asc',
        },
      },
      tools: true,
      tags: true,
      category: true,
    },
  });
  const relatedProjects = await client.coddinkProject.findMany({
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
    orderBy: {
      createdAt: 'desc',
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
          ownerIdx: 'asc',
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
  });

  const isLiked = Boolean(
    await client.coddinkLike.findFirst({
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
    project.owner[0]?.userId !== user?.id
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

export default withApiSession(
  withHandler({ methods: ['GET'], handler, isPrivate: false })
);
