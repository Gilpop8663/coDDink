import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { comment: value },
    query: { id },
    session: { user },
  } = req;

  const comment = await client.idea_comment.create({
    data: {
      comment: value,
      user: {
        connect: {
          id: user?.id,
        },
      },
      project: {
        connect: {
          id: Number(id),
        },
      },
    },
  });

  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
