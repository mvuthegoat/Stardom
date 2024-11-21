import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";

const runwayClient = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Fetch the task status
    const task = await runwayClient.tasks.retrieve(taskId);
    return NextResponse.json(task);
  } catch (error: unknown) {
    console.error("Error fetching task:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to fetch task status", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch task status", details: "An error occurred" },
      { status: 400 }
    );
  }
}
