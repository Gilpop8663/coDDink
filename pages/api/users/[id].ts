import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  const userInfo = await client.coddinkUser.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          like: true,
        },
      },
    },
  });

  if (!userInfo) {
    return res.status(404).json({ ok: false });
  }

  res.json({ ok: true, userInfo });
}

export default withApiSession(
  withHandler({ methods: ['GET'], handler, isPrivate: false })
);
