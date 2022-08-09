import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const alreadyExists = await client.idea_like.findFirst({
    where: {
      projectId: Number(id),
      userId: user?.id,
    },
  });

  if (alreadyExists) {
    await client.idea_like.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.idea_like.create({
      data: {
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
  }

  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
