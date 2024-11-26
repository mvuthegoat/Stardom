import { NextResponse } from "next/server";
import { Pool } from "pg";
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Video } from "../../../types/videoTypes";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function migrateS3Object(
  objectKey: string | null,
  tempBucket: string,
  permanentBucket: string
): Promise<void> {
  if (!objectKey) return;

  try {
    // Copy the object to the permanent bucket
    const copyCommand = new CopyObjectCommand({
      CopySource: `${tempBucket}/${encodeURIComponent(objectKey)}`,
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
    const body = await request.json();
    const {
      title,
      video_key,
      likes = 0,
      crypto_address = "",
      original_image_key,
      meme_origin,
      creator_id,
      dex_chart = "",
      description = "",
    }: Partial<Video> = body;

    // Validate required fields
    if (!title || !meme_origin || !creator_id) {
      return NextResponse.json(
        { error: "Missing required fields: title, meme_origin, or creator_id" },
        { status: 400 }
      );
    }

    // Validate that at least one file key is provided
    if (!video_key && !original_image_key) {
      return NextResponse.json(
        { error: "At least one file (video or image) must be provided" },
        { status: 400 }
      );
    }

    const tempBucket = process.env.TEMP_BUCKET_NAME!;
    const permanentBucket = process.env.PERMANENT_BUCKET_NAME!;

    // Migrate files that exist
    const migrationPromises = [];
    if (video_key) {
      migrationPromises.push(
        migrateS3Object(video_key, tempBucket, permanentBucket)
      );
    }
    if (original_image_key) {
      migrationPromises.push(
        migrateS3Object(original_image_key, tempBucket, permanentBucket)
      );
    }

    // Wait for all migrations to complete
    await Promise.all(migrationPromises);

    // Insert into database
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
      video_key || null, // Explicitly set null if undefined
      likes,
      crypto_address,
      original_image_key || null, // Explicitly set null if undefined
      meme_origin,
      creator_id,
      dex_chart,
      description,
    ];

    const { rows } = await pool.query(query, values);
    const newVideo = rows[0];

    console.log(
      `Data successfully inserted to the database for content: ${title}`
    );

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Error publishing content:", error);

    // More specific error handling
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
