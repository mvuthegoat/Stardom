import { NextRequest, NextResponse } from "next/server";
import { KLING_API_BASE_URL, getApiToken } from "../../../../utils/klingApi";

export async function POST(req: NextRequest) {
  try {
    // Parse incoming JSON data from the client
    const { image, prompt, model_name = "kling-v1" } = await req.json();

    // Validate required fields
    if (!image) {
      return NextResponse.json(
        { error: "Image URL is required." },
        { status: 400 }
      );
    }

    // Get the JWT token for authentication
    const token = await getApiToken();

    // Prepare the request payload for Kling AI API
    const requestBody = {
      model_name, // Default model name
      image, // Publicly accessible image URL
      prompt, // Optional prompt from the client
    };

    // Send the request to Kling AI API
    const response = await fetch(KLING_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // Handle errors from Kling AI API
    if (!response.ok) {
      console.error("Kling AI API error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to create task." },
        { status: response.status }
      );
    }

    console.log("Create Task succeed: ", data);
    // Return the task ID and any additional details to the frontend
    return NextResponse.json(data); // Example response: { taskId: "abc12345", status: "pending" }
  } catch (error) {
    console.error("Error in Create Task:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the task." },
      { status: 500 }
    );
  }
}
