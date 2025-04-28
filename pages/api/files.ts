import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, type } = req.body;

    const fileName = `${Date.now()}_${name}`;
    const Key = `images/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key,
      ContentType: type,
      CacheControl: 'public, max-age=31536000',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // 60초 동안 유효한 URL

    res.status(200).json({ url: signedUrl, fileName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating signed URL' });
  }
}

export default handler;
