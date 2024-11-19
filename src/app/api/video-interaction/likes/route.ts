import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { video_id, increment } = await request.json();

    // Validate the request body
    if (!video_id || typeof increment !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body for video-interaction. 'video_id' and 'increment' are required." },
        { status: 400 }
      );
    }

    // Construct the SQL query to update likes
    const query = `
      UPDATE stardom_videos
      SET likes = likes ${increment ? "+" : "-"} 1
      WHERE id = $1
      RETURNING likes;
    `;

    // Execute the query
    const result = await pool.query(query, [video_id]);

    // Check if the video exists
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Return the updated likes count
    const updatedLikes = result.rows[0].likes;
    return NextResponse.json({ likes: updatedLikes });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
