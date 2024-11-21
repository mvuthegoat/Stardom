import { useState, useCallback } from "react";
import { createTask, queryTask } from "@/services/videogen/apiServices"; // Assume your API services are implemented

export const useVideoGeneration = () => {
  const [videoUrl, setVideoUrl] = useState<string| null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const generateVideo = useCallback(async (imageUrl: string, prompt: string | undefined) => {
    setLoading(true);
    setError("");

    try {
      // Create the task
      const createResponse = await createTask(imageUrl, prompt);
      const taskId = createResponse.data.task_id;

      // Start polling for the task status
      const pollTaskStatus = async () => {
        try {
          const queryResponse = await queryTask(taskId);
          const taskStatus = queryResponse.data.task_status;

          if (taskStatus === "succeed") {
            setVideoUrl(queryResponse.data.task_result?.videos?.[0]?.url || null);
            setLoading(false);
          } else if (taskStatus === "failed") {
            setError(queryResponse.data.task_status_msg || "Video generation failed.");
            setLoading(false);
          } else {
            // Continue polling if still processing
            setTimeout(pollTaskStatus, 5000); // Poll every 5 seconds
          }
        } catch (error) {
          setError("Error querying task status. Please try again.");
          setLoading(false);
        }
      };

      pollTaskStatus();
    } catch (error) {
      setError("Error creating video generation task.");
      setLoading(false);
    }
  }, []);

  return { videoUrl, generateVideo, loading, error };
};
