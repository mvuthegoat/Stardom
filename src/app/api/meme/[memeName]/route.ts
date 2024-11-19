import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ memeName: string }> }
) {
  const { memeName } = await params; // Get `memeName` from dynamic route
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  console.log("memeName:", memeName);

  if (!memeName) {
    return NextResponse.json(
      { error: "Meme name is required" },
      { status: 400 }
    );
  }

  try {
    // TODO: must fetch the exact correct memecoin (maybe filter by crypto address or *new* column like memecoin username (like twitter usernam, must be unique))
    const result = await pool.query(
      "SELECT * FROM stardom_videos WHERE meme_origin ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [memeName, limit, offset]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
