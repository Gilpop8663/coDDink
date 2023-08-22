import { promises as fs } from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'json');
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + '/country-states.json',
    'utf8'
  );

  const parseContent = JSON.parse(fileContents);
  //Return the content of the data file in json format

  res.status(200).json({
    ok: true,
    parseContent,
  });
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
