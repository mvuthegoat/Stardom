"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import {
  UploadBox,
  PromptBox,
  ConfigButton,
  GenerateButton,
  OutputVideoBox,
} from "../../components";
import styles from "./CreateFun.module.css";
import { uploadFileToTemporaryS3 } from "../../utils/s3Utils";
import { extractVideoFileObject } from "../../utils/extractVideoFileObject";
import PublishContent from "../PublishContent/PublishContent";
import {
  checkGenerationLimit,
  incrementGenerationCount,
  getDeviceId,
  addBonusGeneration,
} from "../../utils/usageLimit";
import { Feedback, FeedbackForm } from "../FeedbackForm/FeedbackForm";

const CreateFunV2 = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null); // for img-to-video API call
  const [imageObjectKey, setImageObjectKey] = useState<string | null>(null); // to store in db, later use this to get the signed URL to retrieve the image
  const [videoObjectKey, setVideoObjectKey] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const [duration, setDuration] = useState<number>(5);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [remainingGenerations, setRemainingGenerations] = useState<number>(2);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [hasBonusGeneration, setHasBonusGeneration] = useState(false);

  const handleFileUpload = async (file: File | null) => {
    if (!file) {
      setImageUrl(null);
      setImageObjectKey(null);
      return;
    }

    try {
      const tempImageData = await uploadFileToTemporaryS3(file); // Call your S3 upload function
      const { mediaUrl, objectKey } = tempImageData;

      setImageUrl(mediaUrl); // Set the presigned URL (publicly accessible image url)
      setImageObjectKey(objectKey); // Set the object key for future reference
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle upload error (e.g., show an error message)
    }
  };

  const handleVideoDelete = () => {
    setVideoUrl("");
    setVideoObjectKey(null);
  };

  useEffect(() => {
    if (!videoUrl) return;
    // Define an async function inside useEffect
    const processVideo = async () => {
      try {
        const videoFile = await extractVideoFileObject(videoUrl); // Await the promise
        const tempVideoData = await uploadFileToTemporaryS3(videoFile); // Upload the file to S3

        const { objectKey } = tempVideoData;
        setVideoObjectKey(objectKey);
      } catch (error) {
        console.error("Error getting video:", error);
      }
    };

    // Call the async function
    processVideo();
  }, [videoUrl]);

  useEffect(() => {
    const { remaining } = checkGenerationLimit();
    setRemainingGenerations(remaining);
  }, []);

  const onGenerate = async () => {
    if (!imageUrl) {
      setError("Please upload an image before generating.");
      return;
    }

    // Check generation limit
    const { canGenerate } = checkGenerationLimit();
    if (!canGenerate) {
      setError(
        "You've reached your free generation limit. Please contact us for more!"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the server-side API route
      const response = await fetch("/api/runwayml/image-to-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gen3a_turbo", // Replace with your desired model
          promptImage: imageUrl,
          promptText: prompt || undefined,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();
        const errorMessage =
          errorData?.details || "An unexpected error from AI models occurred.";
        setError(errorMessage);
      }

      const task = await response.json();
      console.log("Task Created:", task);

      // Start polling for task status
      pollTaskStatus(task.id);
    } catch (err: Error | unknown) {
      console.error("Error generating video:", err);
      if (!error) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      }
    } finally {
      //   setLoading(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/runwayml/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch task status");
        }

        const task = await response.json();
        // console.log("Task Status:", task);

        if (task.status === "SUCCEEDED") {
          clearInterval(interval);
          setVideoUrl(task.output[0]); // Use the first output URL
          setLoading(false);
          // Increment count only after confirmed success
          incrementGenerationCount();
          const { remaining } = checkGenerationLimit();
          setRemainingGenerations(remaining);
        } else if (task.status === "FAILED") {
          clearInterval(interval);
          setError(`Task failed: ${task.failure || "Unknown reason."}`);
          setLoading(false);
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Error polling task status:", err);
        setError("An error occurred while polling task status.");
        setLoading(false);
      }
    }, 5000); // Poll every 5 seconds
  };

  // Add useEffect to check bonus generation status
  useEffect(() => {
    const { hasBonusGeneration } = checkGenerationLimit();
    setHasBonusGeneration(hasBonusGeneration);
  }, []);

  // Add feedback submission handler
  const handleFeedbackSubmit = async (feedback: Feedback) => {
    try {
      // Send feedback to your backend/database
      await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...feedback,
          deviceId: getDeviceId(),
          timestamp: new Date().toISOString(),
        }),
      });

      // Grant bonus generation
      addBonusGeneration();
      const { remaining } = checkGenerationLimit();
      setRemainingGenerations(remaining);
      setHasBonusGeneration(true);
      setShowFeedbackForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className={styles.createFunContainer}>
      <div className={styles.inputSection}>
        <UploadBox onFileSelect={handleFileUpload} />
        <PromptBox prompt={prompt} setPrompt={setPrompt} />
        <ConfigButton duration={duration} setDuration={setDuration} />
        <div className="text-sm text-gray-600">
          {remainingGenerations > 0 ? (
            <span>{remainingGenerations} free generations remaining</span>
          ) : !hasBonusGeneration ? (
            <div className="bg-yellow-50 p-3 rounded-lg space-y-2">
              <p className="text-yellow-800">
                You&#39;ve reached your free limit
              </p>
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm w-full"
              >
                Get 1 more free generation (share feedback)
              </button>
              <a
                href="https://twitter.com/messages/compose?recipient_id=1274973675393961984"
                className="twitter-dm-button text-blue-500 hover:underline block text-center"
                data-screen-name="@mvu_goat"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message us on X for more!
              </a>
            </div>
          ) : (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-yellow-800">
                You&#39;ve reached your free limit
              </p>
              <a
                href="https://twitter.com/messages/compose?recipient_id=1274973675393961984"
                className="twitter-dm-button text-blue-500 hover:underline mt-2 inline-block"
                data-screen-name="@mvu_goat"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message us on X for more!
              </a>
            </div>
          )}
        </div>
        <GenerateButton onGenerate={onGenerate} />
        {loading && (
          <div className="flex items-center gap-2 text-black">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating your video... please wait!
          </div>
        )}{" "}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
      <div className={styles.outputSection}>
        <OutputVideoBox videoUrl={videoUrl} onDelete={handleVideoDelete} />
        <PublishContent
          imageObjectKey={imageObjectKey}
          videoObjectKey={videoObjectKey}
          // description={prompt}
          isDisabled={!videoUrl}
        />
      </div>
      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <FeedbackForm
          onSubmit={handleFeedbackSubmit}
          onClose={() => setShowFeedbackForm(false)}
        />
      )}
    </div>
  );
};

export default CreateFunV2;
