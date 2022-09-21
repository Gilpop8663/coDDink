import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { ContentProps, UserDataProps } from "pages/portfolio/editor";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      body: { projectId },
      session: { user },
    } = req;

    await client.coddinkProject.delete({
      where: {
        id: projectId,
      },
    });

    return res.json({
      ok: true,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
