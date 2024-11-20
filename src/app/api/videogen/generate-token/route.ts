import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_KEY = process.env.KLING_ACCESS_KEY || ""; // Add your access key in .env file
const SECRET_KEY = process.env.KLING_SECRET_KEY || ""; // Add your secret key in .env file

export async function POST(req: NextRequest) {
  try {
    if (!ACCESS_KEY || !SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing ACCESS_KEY or SECRET_KEY" },
        { status: 500 }
      );
    }

    // Generate JWT Token
    const headers = {
      alg: "HS256",
      typ: "JWT",
    };

    const payload = {
      iss: ACCESS_KEY,
      exp: Math.floor(Date.now() / 1000) + 1800, // Expiration time: current time + 1800s (30min)
      nbf: Math.floor(Date.now() / 1000) - 5, // Not valid before: current time - 5s
    };

    const token = jwt.sign(payload, SECRET_KEY, { header: headers });
    console.log("GET TOKEN SUCCEED: ", token);
    return NextResponse.json({ token }); // Return the token
  } catch (error) {
    console.error("Error generating JWT token:", error);
    return NextResponse.json(
      { error: "Error generating JWT token" },
      { status: 500 }
    );
  }
}
