import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const projects = await client.coddinkLike.findMany({
    where: {
      userId: Number(id),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: {
        include: {
          _count: { select: { like: true } },
          owner: {
            orderBy: {
              ownerIdx: "asc",
            },
            select: {
              name: true,
              userId: true,
              user: {
                select: {
                  name: true,
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

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: false })
);
