import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { name },
    session: { user: SESSION_USER },
  } = req;

  const user = await client.CoddinkUser.findMany({
    where: {
      name: {
        contains: name?.toString(),
      },
      NOT: {
        id: SESSION_USER?.id,
      },
    },
    select: {
      name: true,
      avatar: true,
      id: true,
    },
  });

  return res.status(200).json({ ok: true, user });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
