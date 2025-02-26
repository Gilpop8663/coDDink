import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

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
  const { id } = req.query;
  const filePath = path.resolve(process.cwd(), 'db.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(jsonData);

  const project = data[id as string];

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.status(200).json(project);
}

const corsHandler = (req: NextApiRequest, res: NextApiResponse) => {
  cors(req, res, () => handler(req, res));
};

export default corsHandler;
