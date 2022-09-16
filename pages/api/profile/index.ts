import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

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
      banner,
      Facebook,
      Youtube,
      Github,
      Twitter,
      Instagram,
      LinkedIn,
      Twitch,
      Dribble,
      avatarId,
    },
  } = req;

  if (banner) {
    await client.idea_user.update({
      where: { id: user?.id },
      data: {
        bannerSrc: banner.imageSrc,
        bannerPosition: banner.position,
      },
    });

    return res.json({ ok: true });
  }

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

  if (avatarId) {
    await client.idea_user.update({
      where: {
        id: user?.id,
      },
      data: {
        avatar: avatarId,
      },
    });
  }

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: true })
);
