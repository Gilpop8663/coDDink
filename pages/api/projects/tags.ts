import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { ContentProps } from "pages/portfolio/editor";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
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
        content,
      },
      session: { user },
    } = req;
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
