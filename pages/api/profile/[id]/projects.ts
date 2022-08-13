import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { profile } from "console";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const projects = await client.idea_project.findMany({
    where: {
      userId: Number(id),
    },
    include: {
      _count: {
        select: {
          like: true,
        },
      },
      user: {
        select: {
          avatar: true,
          name: true,
        },
      },
    },
  });

  res.json({ ok: true, projects });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
