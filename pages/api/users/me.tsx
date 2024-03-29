import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user === undefined) {
    res.json({
      ok: false,
    });
    return res.status(200).end();
  }

  const profile = await client.coddinkUser.findUnique({
    where: {
      id: req.session.user?.id,
    },
    include: {
      followers: true,
      followings: true,
    },
  });

  res.json({
    ok: true,
    profile,
  });

  return res.status(200).end();
}

export default withApiSession(
  withHandler({ methods: ['GET'], handler, isPrivate: false })
);
