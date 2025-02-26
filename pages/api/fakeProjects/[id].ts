import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';

const cors = Cors({
  origin: 'https://project-worldcup.netlify.app', // fakeProjects의 실제 도메인
  allowMethods: ['GET', 'POST'],
  allowCredentials: true,
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const filePath = path.resolve(process.cwd(), 'db.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(jsonData);

  const project = data[id as string];

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.status(200).json(project);
};

const corsHandler = (req: IncomingMessage, res: ServerResponse) => {
  cors(() => handler(req as NextApiRequest, res as NextApiResponse));
};

export default corsHandler;
