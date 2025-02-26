import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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
