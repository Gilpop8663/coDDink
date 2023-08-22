import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { commentId },
      session: { user },
    } = req;

    console.log(commentId);

    await client.coddinkComment.delete({
      where: {
        id: commentId,
      },
    });

    return res.json({ ok: true });
  }
}

export default withApiSession(withHandler({ methods: ['POST'], handler }));
