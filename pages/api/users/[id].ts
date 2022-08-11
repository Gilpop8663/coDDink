import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { profile } from "console";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  const userInfo = await client.idea_user.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json({ ok: true, userInfo });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
