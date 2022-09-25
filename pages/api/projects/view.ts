import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { projectId },
    session: { user },
  } = req;

  if (!user) return res.json({ ok: false });

  const alreadyExists = await client.coddinkProjectView.findFirst({
    where: {
      userId: user?.id,
      projectId: projectId,
    },
  });

  if (alreadyExists) return res.json({ ok: true });

  await client.coddinkProjectView.create({
    data: {
      project: {
        connect: {
          id: projectId,
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
