import { NextRequest, NextResponse } from "next/server";
import { KLING_API_BASE_URL, getApiToken } from '@/utils/klingApi'; // Assuming shared utilities

export async function GET(req: NextRequest) {
  try {
    // Extract task_id from query parameters
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("task_id");

    // Validate that task_id is provided
    if (!taskId) {
      return NextResponse.json(
        { error: "task_id is required to query the task." },
        { status: 400 }
      );
    }

    // Generate the API token
    const token = await getApiToken();

    // Query Kling AI API for the task status
    const response = await fetch(`${KLING_API_BASE_URL}/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    // Handle errors from Kling AI API
    if (!response.ok) {
      console.error("Kling AI Query Task Error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to query task." },
        { status: response.status }
      );
    }

    // Return the task details to the client
    console.log("Query task single succeed: ", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in Query Task (Single):", error);
    return NextResponse.json(
      { error: "An error occurred while querying the task." },
      { status: 500 }
    );
  }
}
