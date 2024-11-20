const KLING_API_BASE_URL = "https://api.klingai.com/v1/videos/image2video";

// Helper to fetch the token from your token-generation API route
async function getApiToken() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/videogen/generate-token`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to generate API token");
  }

  const { token } = await response.json();
  return token;
}

export { KLING_API_BASE_URL, getApiToken };
