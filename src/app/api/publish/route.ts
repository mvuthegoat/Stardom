import { NextResponse } from "next/server";
import { Pool } from "pg";
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Video } from "@/types/videoTypes";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
});

const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Helper function to migrate objects in S3
async function migrateS3Object(
  objectKey: string,
  tempBucket: string,
  permanentBucket: string
) {
  try {
    // Copy the object to the permanent bucket
    const copyCommand = new CopyObjectCommand({
      CopySource: `${tempBucket}/${objectKey}`,
      Bucket: permanentBucket,
      Key: objectKey,
    });

    await s3Client.send(copyCommand);

    // Delete the object from the temporary bucket
    const deleteCommand = new DeleteObjectCommand({
      Bucket: tempBucket,
      Key: objectKey,
    });

    await s3Client.send(deleteCommand);

    console.log(`Object ${objectKey} successfully moved to permanent storage.`);
  } catch (error) {
    console.error(`Error migrating object ${objectKey} in S3:`, error);
    throw new Error(`Failed to migrate object: ${objectKey}`);
  }
}

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const body = await request.json();
    const {
      title,
      video_key,
      likes = 0, // Default to 0 likes
      crypto_address = "",
      original_image_key,
      meme_origin,
      creator_id,
      dex_chart = "", // Default to null if not provided
      description = "", // Default to null if not provided
    }: Partial<Video> = body;

    // Validate required fields
    if (
      !title ||
      !video_key ||
      !original_image_key ||
      !meme_origin ||
      !creator_id
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tempBucket = process.env.TEMP_BUCKET_NAME!;
    const permanentBucket = process.env.PERMANENT_BUCKET_NAME!;

    await Promise.all([
      migrateS3Object(video_key, tempBucket, permanentBucket), // Migrate video
      migrateS3Object(original_image_key, tempBucket, permanentBucket), // Migrate image
    ]);

    // Step 2: Insert video metadata into the database
    const query = `
      INSERT INTO stardom_videos (
        title,
        video_key,
        likes,
        crypto_address,
        original_image_key,
        meme_origin,
        creator_id,
        dex_chart,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      title,
      video_key,
      likes,
      crypto_address,
      original_image_key,
      meme_origin,
      creator_id,
      dex_chart,
      description,
    ];

    const { rows } = await pool.query(query, values);
    const newVideo = rows[0];

    console.log(`Video data successfully inserted to the database for ${video_key}.`);

    // Respond with the newly created video entry
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Error publishing video:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
