import { Video } from "@/types/videoTypes";
import { MemeStats } from "@/types/memeTypes";

export async function searchInspiration(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<Video[]> {
  console.log("searchInspiration called with:", { query, page, limit });

  try {
    const res = await fetch(
      `/api/search/inspiration?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorDetails = await res.text();
      console.error("Search failed. Details:", errorDetails);
      throw new Error(`Search failed with status ${res.status}`);
    }

    const responseData = await res.json();
    console.log("Response data:", responseData);

    // Extract the 'data' property from the response
    const result: Video[] = responseData.data;

    return result;
  } catch (error) {
    console.error("Error in searchInspiration:", error);
    throw error; // Re-throw for handling in the caller
  }
}

export async function searchMemecoins(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<MemeStats[]> {
  try {
    const res = await fetch(
      `/api/search/memecoins?q=${query}&page=${page}&limit=${limit}`
    );

    if (!res.ok) {
      const errorDetails = await res.text();
      console.error("Search failed. Details:", errorDetails);
      throw new Error(`Search failed with status ${res.status}`);
    }

    const responseData = await res.json();
    console.log("Response data:", responseData);

    // Extract the 'data' property from the response
    const result: MemeStats[] = responseData.data;

    return result;
  } catch (error) {
    console.error("Error in searchMemecoins:", error);
    throw error; // Re-throw for handling in the caller
  }
}
