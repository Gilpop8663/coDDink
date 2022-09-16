import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const projects = await client.idea_like.findMany({
    where: {
      userId: Number(id),
    },
    include: {
      project: {
        include: {
          _count: { select: { like: true } },
          owner: {
            orderBy: {
              id: "desc",
            },
            select: {
              name: true,
              userId: true,
              user: {
                select: {
                  avatar: true,
                  city: true,
                  country: true,
                },
              },
            },
          },
        },
      },
    },
  });

  res.json({ ok: true, projects });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
