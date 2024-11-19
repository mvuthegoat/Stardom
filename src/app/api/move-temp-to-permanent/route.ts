import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function POST(request: NextRequest) {
  try {
    const { objectKey } = await request.json();

    if (!objectKey) {
      return NextResponse.json(
        { error: "Object key is required" },
        { status: 400 }
      );
    }

    // Copy the object from the temp bucket to the permanent bucket
    const copyCommand = new CopyObjectCommand({
      CopySource: `${process.env.TEMP_BUCKET_NAME}/${objectKey}`,
      Bucket: process.env.PERMANENT_BUCKET_NAME!,
      Key: objectKey,
    });

    await s3Client.send(copyCommand);

    // Delete the object from the temp bucket
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.TEMP_BUCKET_NAME!,
      Key: objectKey,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json({ message: "Object moved successfully" });
  } catch (error) {
    console.error("Error moving object:", error);
    return NextResponse.json(
      { error: "Failed to move object" },
      { status: 500 }
    );
  }
}
