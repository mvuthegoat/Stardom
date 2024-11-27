import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Feedback Type
interface Feedback {
  deviceId: string;
  useCase: string;
  createFunRating: string;
  haveFunRating: string;
  improvements: string;
  email?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: Feedback = await request.json();

    // Validate required fields
    const {
      deviceId,
      useCase,
      createFunRating,
      haveFunRating,
      improvements,
      email,
      timestamp,
    } = body;

    if (
      !deviceId ||
      !useCase ||
      !createFunRating ||
      !haveFunRating ||
      !improvements ||
      !timestamp
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // SQL Query to insert feedback
    const query = `
      INSERT INTO feedback (
        device_id,
        use_case,
        create_fun_rating,
        have_fun_rating,
        improvements,
        email,
        timestamp
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [
      deviceId,
      useCase,
      createFunRating,
      haveFunRating,
      improvements,
      email || null, // Handle optional email
      timestamp,
    ];

    // Execute the query
    await pool.query(query, values);

    return NextResponse.json(
      { success: true, message: "Feedback submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting feedback into database:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
