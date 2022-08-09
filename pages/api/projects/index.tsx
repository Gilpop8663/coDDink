import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const projects = await client.idea_project.findMany({
      include: {
        user: {
          select: {
            avatar: true,
            name: true,
          },
        },
        _count: {
          select: {
            like: true,
          },
        },
      },
    });

    res.json({
      ok: true,
      projects,
    });
  }

  if (req.method === "POST") {
    const {
      body: {
        title,
        description,
        category,
        owner,
        tags,
        tools,
        visible,
        avatar,
      },
      session: { user },
    } = req;

    const project = await client.idea_project.create({
      data: {
        title,
        description,
        category,
        owner,
        tags,
        tools,
        visible,
        view: 0,
        avatar,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      project,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
