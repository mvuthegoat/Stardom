import { Video } from "@/types/videoTypes";

// Fetch discovery feed videos
export async function fetchDiscoveryFeed(
  page: number = 1,
  limit: number = 10
): Promise<Video[]> {
  const response = await fetch(`/api/feed/videos?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch discovery feed videos");
  }
  return response.json();
}

// Fetch meme-specific videos
// export async function fetchMemeNameVideos(
//   memeName: string,
//   page: number = 1,
//   limit: number = 10,
// ): Promise<Video[]> {
//   const response = await fetch(`/api/meme/${memeName}?page=${page}&limit=${limit}`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch collection videos");
//   }
//   return response.json();
// }
// export async function fetchMemeNameVideos(
//     memeName: string,
//     page: number = 1,
//     limit: number = 10
//   ): Promise<Video[]> {
//     const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//     const response = await fetch(`${baseUrl}/api/meme/${memeName}?page=${page}&limit=${limit}`);

//     if (!response.ok) {
//       throw new Error("Failed to fetch collection videos");
//     }

//     return response.json();
//   }

export async function fetchMemeNameVideos(
  memeName: string,
  page: number = 1,
  limit: number = 10
): Promise<Video[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const encodedMemeName = encodeURIComponent(memeName);
    const response = await fetch(
      `${baseUrl}/api/meme/${encodedMemeName}?page=${page}&limit=${limit}`,
      {
        // Add cache options
        cache: "no-store", // or 'force-cache' if you want to cache the results
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch collection videos: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error in fetchMemeNameVideos:", error);
    throw error;
  }
}

// // Fetch category-specific videos
// export async function fetchCategoryVideos(
//   categoryId: string,
//   page: number = 1
// ): Promise<Video[]> {
//   const response = await fetch(`/api/category/${categoryId}?page=${page}&limit=10`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch category videos");
//   }
//   return response.json();
// }
