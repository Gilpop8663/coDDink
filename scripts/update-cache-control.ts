require('dotenv').config();
const {
  S3Client,
  CopyObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'ap-northeast-2', // 서울 리전 예시
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function listFiles(bucketName: string) {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
  });

  try {
    const data = await s3.send(command);
    const files = data.Contents?.map((file: any) => file.Key) || [];
    console.log('Files in the S3 bucket:', files);
    return files;
  } catch (error) {
    console.error('Error fetching files from S3:', error);
    return [];
  }
}

async function updateCacheControl(Key: string) {
  const encodedFileName = encodeURIComponent(Key); // 파일 이름 URL 인코딩
  const CopySource = `${process.env.AWS_BUCKET_NAME}/${encodedFileName}`;

  const command = new CopyObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    CopySource,
    Key,
    MetadataDirective: 'REPLACE', // 메타데이터 덮어쓰기
    ContentType: 'image/webp', // 원래 파일 타입 맞춰야 함
    CacheControl: 'public, max-age=31536000', // 여기 추가!
  });

  await s3.send(command);
}

const bucketName = process.env.AWS_BUCKET_NAME!;

const files = listFiles(bucketName).then((files) => {
  (async () => {
    for (const file of files) {
      await updateCacheControl(file);
      console.log(`Updated CacheControl for ${file}`);
    }
  })();
});
