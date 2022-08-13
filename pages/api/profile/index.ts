import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { profile } from "console";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body: {
      name,
      job,
      company,
      country,
      city,
      URL,
      introduce,
      Facebook,
      Youtube,
      Github,
      Twitter,
      Instagram,
      LinkedIn,
      Twitch,
      Dribble,
    },
  } = req;

  const updateUser = await client.idea_user.update({
    where: {
      id: user?.id,
    },
    data: {
      name,
      job,
      company,
      country,
      city,
      URL,
      introduce,
      Facebook,
      Youtube,
      Github,
      Twitter,
      Instagram,
      LinkedIn,
      Twitch,
      Dribble,
    },
  });

  console.log(updateUser);

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: true })
);
