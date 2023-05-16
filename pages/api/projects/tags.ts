import { NextApiRequest, NextApiResponse } from 'next';
import { ContentProps } from 'pages/portfolio/editor';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
  }

  if (req.method === 'POST') {
    const {
      body: {
        title,
        description,
        category,
        owner,
        tags,
        tools,
        visible,
        avatar,
        content,
      },
      session: { user },
    } = req;
  }
}

export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], handler })
);
