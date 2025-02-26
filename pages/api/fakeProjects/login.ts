import { IncomingMessage } from 'http';
import { ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';

const users = [
  {
    id: 'test1',
    name: '이○○',
    password: '12345',
    img: 'https://cdn-icons-png.flaticon.com/512/5740/5740330.png',
  },
  {
    id: 'test2',
    name: '최○○',
    password: '12345',
    img: 'https://cdn-icons-png.flaticon.com/512/5799/5799896.png',
  },
  {
    id: 'test3',
    name: '박○○',
    password: '12345',
    img: 'https://cdn-icons-png.flaticon.com/512/1876/1876934.png',
  },
  {
    id: 'test4',
    name: '김○○',
    password: '12345',
    img: 'https://cdn-icons-png.flaticon.com/512/4149/4149071.png',
  },
];

const cors = Cors({
  origin: '*',
  allowMethods: ['GET', 'POST'],
  allowCredentials: true,
});

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: 'ID와 비밀번호를 입력하세요.' });
  }

  const userInfo = users.find(
    (user) => user.id === id && user.password === password
  );

  if (userInfo) {
    return res.status(200).json({ message: '로그인 성공', user: userInfo });
  } else {
    return res
      .status(401)
      .json({ message: '로그인 실패: ID 또는 비밀번호가 틀렸습니다.' });
  }
}

const corsHandler = (req: IncomingMessage, res: ServerResponse) => {
  cors(() => handler(req as NextApiRequest, res as NextApiResponse));
};

export default corsHandler;
