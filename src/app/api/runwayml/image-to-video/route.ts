import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";

const runwayClient = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { model, promptImage, promptText } = await req.json();

    // Call the RunwayML API
    const task = await runwayClient.imageToVideo.create({
      model,
      promptImage,
      promptText,
      duration: 5,
      ratio: "1280:768",
    });

    return NextResponse.json(task);
  } catch (error: any) {
    console.error("RunwayML API error:", error);

    return NextResponse.json(
      { error: "Failed to create task", details: error.message },
      { status: 400 }
    );
  }
}
