import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { email, fullName },
  } = req;

  const user = await client.coddinkUser.findUnique({
    where: {
      email,
    },
  });

  const number = Math.floor(Math.random() * 2);

  const avatarURL = [
    "f0787368-2456-4b9e-6ae4-a8841f70b300",
    "8b9dd122-cda2-4183-e41e-2c8d9259ac00",
  ];

  if (!user) {
    //가입하지 않은 경우 가입을 해야함

    const createUser = await client.coddinkUser.create({
      data: {
        email: email,
        name: fullName,
        password: uuidv4(),
        avatar: avatarURL[number],
      },
    });

    res.json({
      ok: true,
      message: "회원가입이 완료되었습니다",
    });

    return res.status(200).end;
  } else {
    //가입되어 있는 경우 로그인

    req.session.user = {
      id: user.id,
    };

    await req.session.save();

    res.json({
      ok: true,
      message: "회원 로그인 완료",
    });

    return res.status(200).end();
  }
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
