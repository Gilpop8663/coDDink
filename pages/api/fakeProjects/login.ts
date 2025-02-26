import { NextApiRequest, NextApiResponse } from 'next';

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

const cors = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 요청을 허용할 도메인
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // 허용할 HTTP 메서드
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 허용할 요청 헤더
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 자격 증명 허용

  // OPTIONS 메서드에 대한 응답 처리 (브라우저의 preflight 요청)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next(); // 미들웨어가 끝나면 핸들러로 넘김
};

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

const corsHandler = (req: NextApiRequest, res: NextApiResponse) => {
  cors(req, res, () => handler(req, res));
};

export default corsHandler;
