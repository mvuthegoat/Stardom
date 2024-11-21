import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType } = await request.json();

    // Determine the folder based on the file type
    let folder = '';
    if (fileType.startsWith('image/')) {
      folder = 'images/';
    } else if (fileType.startsWith('video/')) {
      folder = 'videos/';
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const newFileName = fileType == 'image' ? "uploaded_image" : "generated_video";
    const bucketName = process.env.TEMP_BUCKET_NAME!;
    const objectKey = `${folder}${Date.now()}_${uuidv4()}_${newFileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ presignedUrl, objectKey });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Cannot generate presigned URL' }, { status: 500 });
  }
}
