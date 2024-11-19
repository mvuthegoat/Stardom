import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
});

export async function GET(req: Request) {
  try {
    // Extract search params
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page
    const offset = (page - 1) * limit;

    // Validate input
    if (!query) {
      return NextResponse.json(
        {
          message: "Query parameter 'q' is required.",
          data: [],
        },
        { status: 400 }
      );
    }
    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return NextResponse.json(
        {
          message:
            "Invalid 'page' or 'limit' parameter. Must be positive integers.",
          data: [],
        },
        { status: 400 }
      );
    }

    // Execute the database query
    // const result = await pool.query(
    //   `SELECT meme_origin, COUNT(*) AS total_videos, SUM(likes) AS total_likes, MAX(created_at) AS latest_video_date
    //     FROM stardom_videos
    //     WHERE meme_origin ILIKE $1
    //     GROUP BY meme_origin
    //     ORDER BY total_likes DESC
    //     LIMIT $2 OFFSET $3`,
    //   [`%${query}%`, limit, offset]
    // );

    // query to include the first original_image_key for each meme_origin
    // This is just a short-term solution to display the profile pic of every memecoin
    const result = await pool.query(
      `WITH grouped_videos AS (
          SELECT DISTINCT ON (meme_origin) 
                 meme_origin, 
                 original_image_key, 
                 COUNT(*) OVER (PARTITION BY meme_origin) AS total_videos, 
                 SUM(likes) OVER (PARTITION BY meme_origin) AS total_likes, 
                 MAX(created_at) OVER (PARTITION BY meme_origin) AS latest_video_date
          FROM stardom_videos
          WHERE meme_origin ILIKE $1
          ORDER BY meme_origin, total_likes DESC
        )
        SELECT meme_origin, 
               total_videos, 
               total_likes, 
               latest_video_date, 
               original_image_key
        FROM grouped_videos
        ORDER BY total_likes DESC
        LIMIT $2 OFFSET $3;`,
      [`%${query}%`, limit, offset]
    );

    // Return paginated response
    return NextResponse.json({
      message: "Success",
      data: result.rows,
      pagination: {
        page,
        limit,
        total: result.rows.length,
      },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
