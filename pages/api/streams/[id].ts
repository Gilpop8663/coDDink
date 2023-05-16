import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const stream = await client.coddinkStream.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json({ ok: true, stream });
}
export default withApiSession(
  withHandler({ methods: ['GET'], handler, isPrivate: false })
);
