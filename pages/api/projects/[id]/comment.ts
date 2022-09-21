import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { id, commentIdx = 1 },
    } = req;

    const comments = await client.coddinkComment.findMany({
      where: {
        projectId: Number(id),
      },
      take: +commentIdx * 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            avatar: true,
            name: true,
            id: true,
          },
        },
      },
    });

    return res.json({
      ok: true,
      comments,
    });
  }

  if (req.method === "POST") {
    const {
      body: { comment: value },
      query: { id },
      session: { user },
    } = req;

    const comment = await client.coddinkComment.create({
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
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
