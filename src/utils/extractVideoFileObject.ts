const getFileNameFromUrl = (url: string): string => {
    return url.split("/").pop() || "unknown_file.mp4"; // Extract name or use a default
  };
  
  export const extractVideoFileObject = async (videoUrl: string): Promise<File> => {
    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }
  
      const blob = await response.blob();
      const fileName = getFileNameFromUrl(videoUrl); // Extract name from URL
      const file = new File([blob], fileName, { type: blob.type });
  
      console.log("Extracted File Object:", file);
      return file;
    } catch (error) {
      console.error("Error extracting file object:", error);
      // Re-throw the error so the caller can handle it
      throw new Error("Could not extract video file object.");
    }
  };
  