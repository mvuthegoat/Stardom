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
    // BIG QUERY FOR: all meme_origin names are unified into the earliest meme_origin name for a given crypto_address
    // Plus include any original_image_key for each meme_origin
    // This is just a short-term solution to display the profile pic of every memecoin
    // const result = await pool.query(
    //   `
    //       WITH unified_meme_origin AS (
    //         SELECT DISTINCT ON (crypto_address)
    //           crypto_address,
    //           meme_origin
    //         FROM
    //           stardom_videos
    //         ORDER BY
    //           crypto_address,
    //           created_at ASC
    //       )
    //       SELECT
    //           u.meme_origin,
    //           sv.crypto_address,
    //           COUNT(*) AS total_videos,
    //           SUM(sv.likes) AS total_likes,
    //           MAX(sv.created_at) AS latest_video_date,
    //           MAX(sv.original_image_key) AS original_image_key
    //       FROM
    //           stardom_videos sv
    //       JOIN
    //           unified_meme_origin u
    //         ON
    //           sv.crypto_address = u.crypto_address
    //       WHERE
    //           u.meme_origin ILIKE $1
    //       GROUP BY
    //           u.meme_origin, sv.crypto_address
    //       ORDER BY
    //           u.meme_origin, total_likes DESC
    //       LIMIT $2 OFFSET $3;
    //     `,
    //   [`%${query}%`, limit, offset]
    // );

    // Get distinct crypto_address from a search, then order by most created
    const result = await pool.query(
      `
            SELECT 
                crypto_address, 
                COUNT(*) AS total_videos,
                SUM(likes) AS total_likes,
                MAX(created_at) AS latest_video_date
            FROM 
                stardom_videos
            WHERE 
                meme_origin ILIKE $1
            GROUP BY 
                crypto_address
            ORDER BY 
                total_videos DESC
            LIMIT $2 OFFSET $3;
        `,
      [`%${query}%`, limit, offset]
    );

    // console.log("RESULTS:", result);
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
