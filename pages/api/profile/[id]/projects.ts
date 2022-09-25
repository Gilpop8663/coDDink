import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  if (Number(id) === user?.id) {
    const projects = await client.coddinkProject.findMany({
      where: {
        userId: Number(id),
        isDraft: false,
      },
      include: {
        _count: {
          select: {
            like: true,
          },
        },
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
    });
    return res.json({ ok: true, projects });
  } else {
    const projects = await client.coddinkProject.findMany({
      where: {
        userId: Number(id),
        isDraft: false,
        visible: true,
      },
      include: {
        _count: {
          select: {
            like: true,
          },
        },
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
    });
    return res.json({ ok: true, projects });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
