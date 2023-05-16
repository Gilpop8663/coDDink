import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  if (Number(id) === user?.id) {
    const projects = await client.coddinkProject.findMany({
      where: {
        userId: Number(id),
        isDraft: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
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
    return res.json({ ok: true, projects });
  } else {
    const projects = await client.coddinkProject.findMany({
      where: {
        userId: Number(id),
        isDraft: false,
        visible: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
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
    return res.json({ ok: true, projects });
  }
}

export default withApiSession(
  withHandler({ methods: ['GET'], handler, isPrivate: false })
);
