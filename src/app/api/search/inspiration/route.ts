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
    const queryText = `
    SELECT * FROM stardom_videos 
    WHERE meme_origin ILIKE $1 OR
    title LIKE $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;
    const queryParams = [`%${query}%`, limit, offset];
    // console.log("Executing Query:", queryText);
    // console.log("With Parameters:", queryParams);

    // Execute the database query
    const result = await pool.query(queryText, queryParams);
    // Log the results for debugging
    // console.log("Query Results:", result.rows);

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
