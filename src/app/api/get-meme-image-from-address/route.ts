import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cryptoAddress = searchParams.get("cryptoAddress");

    // Validate `cryptoAddress`
    if (!cryptoAddress) {
      return NextResponse.json(
        { error: "cryptoAddress query parameter is required" },
        { status: 400 }
      );
    }

    const query = `
      SELECT original_image_key 
      FROM stardom_videos 
      WHERE crypto_address = $1 
      ORDER BY created_at ASC 
      LIMIT 1;
    `;
    const values = [cryptoAddress];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No image found for the provided cryptoAddress" },
        { status: 404 }
      );
    }

    // Return the first image key
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching image data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
