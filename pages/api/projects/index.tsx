import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { profile } from "console";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { title, description, category, owner, tags, tools, visible, avatar },
    session: { user },
  } = req;

  if (req.method === "GET") {
    const projects = await client.idea_project.findMany({});
    res.json({
      ok: true,
      projects,
    });
  }

  if (req.method === "POST") {
    const project = await client.idea_project.create({
      data: {
        title,
        description,
        category,
        owner,
        tags,
        tools,
        visible,
        like: 0,
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
