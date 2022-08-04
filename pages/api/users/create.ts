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
  console.log(req.body);
  const salt = await bcrypt.genSalt(saltRounds); // salt 생성

  const hashedPW = await bcrypt.hash(password, salt);

  const number = Math.floor(Math.random() * 2);

  const avatarURL = [
    "https://user-images.githubusercontent.com/80146176/182609032-d9dec753-1824-459c-950a-a15a2a65c1f1.jpg",
    "https://user-images.githubusercontent.com/80146176/182609043-0ea710ef-45c0-4c42-8da7-ce1f89ab3e86.jpg",
  ];

  const user = await client.idea_user.create({
    data: {
      email,
      name,
      password: hashedPW,
      avatar: avatarURL[number],
    },
  });

  console.log(user);

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
