import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

const saltRounds = 10;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, name, password, policy } = req.body;
  const salt = await bcrypt.genSalt(saltRounds); // salt 생성

  const hashedPW = await bcrypt.hash(password, salt);

  const number = Math.floor(Math.random() * 2);

  const avatarURL = [
    "f0787368-2456-4b9e-6ae4-a8841f70b300",
    "8b9dd122-cda2-4183-e41e-2c8d9259ac00",
  ];

  const user = await client.idea_user.create({
    data: {
      email,
      name,
      password: hashedPW,
      avatar: avatarURL[number],
    },
  });

  res.json({
    ok: true,
    message: "회원가입이 완료되었습니다",
  });
  return res.status(200).end();
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: false,
});
