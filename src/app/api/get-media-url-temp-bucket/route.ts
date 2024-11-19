import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function POST(request: NextRequest) {
  try {
    const { objectKey } = await request.json();

    const command = new GetObjectCommand({
      Bucket: process.env.TEMP_BUCKET_NAME!,
      Key: objectKey,
    });

    const mediaUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ mediaUrl });
  } catch (error) {
    console.error('Error generating presigned GET URL:', error);
    return NextResponse.json({ error: 'Cannot generate presigned URL' }, { status: 500 });
  }
}
