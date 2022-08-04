import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log(req.body);
  const { email } = req.body;
  const user = await client.idea_user.findUnique({
    where: {
      email,
    },
  });

  console.log("유서임", user);

  if (!user) {
    // 이메일이 틀린 경우
    res.json({
      ok: false,
      message: "해당 이메일 주소로 등록된 계정을 찾을 수 없습니다.",
    });
    return res.status(200).end();
  }

  res.json({
    ok: true,
    message: "이메일 주소를 찾았습니다.",
    avatar: user.avatar,
  });

  return res.status(200).end();
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: false,
});
