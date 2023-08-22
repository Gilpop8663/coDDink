import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const {
      query: { search, page = 1 },
    } = req;

    const searchProjects = await client.coddinkProject.findMany({
      where: {
        isDraft: false,
        visible: true,
        OR: [
          {
            title: {
              contains: search?.toString(),
            },
          },
          {
            owner: {
              some: {
                user: {
                  name: {
                    contains: search?.toString(),
                  },
                },
              },
            },
          },
          {
            category: {
              some: {
                name: {
                  contains: search?.toString(),
                },
              },
            },
          },
          {
            tags: {
              some: {
                name: {
                  contains: search?.toString(),
                },
              },
            },
          },
          {
            tools: {
              some: {
                name: {
                  contains: search?.toString(),
                },
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
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
      take: 20,
      skip: +page * 20,
    });

    if (!searchProjects) {
      return res.json({ ok: false, projects: [] });
    }

    return res.json({
      ok: true,
      projects: searchProjects,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ['GET'], handler, isPrivate: false })
);
