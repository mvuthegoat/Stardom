import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const object_key = searchParams.get("object_key");
  const type = searchParams.get("type");

  if (!object_key || !type) {
    return NextResponse.json(
      { error: "Missing object_key or types parameter" },
      { status: 400 }
    );
  }

  const typeList = type.split(",");

  const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

  const results: Record<string, string> = {};
  for (const type of typeList) {
    if (type === "video") {
      results.video_url = `${CLOUDFRONT_URL}/${object_key}`;
      // console.log("Generated video URL:", results.video_url); // Debug the generated video URL
    } else if (type === "image") {
      results.image_url = `${CLOUDFRONT_URL}/${object_key}`;
      // console.log("Generated image URL:", results.image_url); // Debug the generated image URL
    }
  }

  return NextResponse.json(results);
}
