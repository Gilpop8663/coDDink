import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import client from '@libs/server/client';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  const user = await client.coddinkUser.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    // 이메일이 틀린 경우
    res.json({
      ok: false,
      message: '존재하지 않는 이메일 주소 입니다',
    });
    return res.status(200).end();
  }
  const check = await bcrypt.compare(password, user?.password);

  if (check) {
    //유효한 회원

    req.session.user = {
      id: user.id,
    };

    await req.session.save();

    res.json({
      ok: true,
      message: '회원 로그인 완료',
    });
  } else {
    //입력한 비밀번호가 같지 않은 경우
    res.json({
      ok: false,
      message: '비밀번호가 올바르지 않습니다',
    });
  }

  return res.status(200).end();
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
    isPrivate: false,
  })
);
