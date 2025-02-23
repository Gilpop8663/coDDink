import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { file, name, type } = req.body; // 클라이언트에서 전송한 파일

      const buffer = Buffer.from(file, 'base64'); // base64 문자열을 버퍼로 변환합니다.

      const fileName = `${Date.now()}_${name}`;
      const Key = `images/${fileName}`;
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key, // 파일명을 고유하게 지정합니다.
        Body: buffer,
        ContentType: type,
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      res
        .status(200)
        .json({ message: 'File uploaded successfully', id: fileName });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error uploading file' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], handler })
);
