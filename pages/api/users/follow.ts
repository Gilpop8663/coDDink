import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { id, myId },
  } = req;

  if (id === myId) return;

  const alreadyExists = await client.coddinkFollow.findFirst({
    where: {
      followerId: Number(id),
    },
  });

  if (alreadyExists) {
    await client.coddinkFollow.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.coddinkFollow.create({
      data: {
        follower: {
          connect: {
            id: id,
          },
        },
        following: {
          connect: {
            id: myId,
          },
        },
      },
    });
  }

  res.json({
    ok: true,
  });
  return res.status(200).end();
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: true,
});
