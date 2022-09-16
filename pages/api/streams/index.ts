import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const streams = await client.idea_stream.findMany({
      take: 10,
      skip: 20,
    });

    res.json({ ok: true, streams });
  }
  if (req.method === "POST") {
    const {
      body: { title, tools, description },
      session: { user },
    } = req;

    const {
      result: {
        uid,
        rtmps: { streamKey, url },
      },
    } = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLAR_ACCOUNT_ID}/stream/live_inputs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_KEY}`,
          },
          body: `{"meta": {"name":"${title}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`,
        }
      )
    ).json();

    const stream = await client.idea_stream.create({
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
  withHandler({ methods: ["GET", "POST"], handler })
);
