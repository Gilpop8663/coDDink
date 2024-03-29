import { off } from 'process';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const streams = await client.coddinkStream.findMany({
      take: 10,
      skip: 20,
    });

    res.json({ ok: true, streams });
  }
  if (req.method === 'POST') {
    const {
      body: { title, tools, description },
      session: { user },
    } = req;

    if (!user?.id) return;

    const {
      result: {
        uid,
        rtmps: { streamKey, url },
      },
    } = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLAR_ACCOUNT_ID}/stream/live_inputs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_KEY}`,
          },
          body: `{"meta": {"name":"${title}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`,
        }
      )
    ).json();

    const stream = await client.coddinkStream.create({
      data: {
        cloudflareId: uid,
        cloudflareKey: streamKey,
        cloudflareUrl: url,
        title,
        tools,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({ ok: true, stream });
  }
}

export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], handler, isPrivate: false })
);
