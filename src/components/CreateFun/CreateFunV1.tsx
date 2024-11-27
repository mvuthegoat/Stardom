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
import { uploadFileToTemporaryS3 } from "@/utils/s3Utils";
import { extractVideoFileObject } from "../../utils/extractVideoFileObject";
import PublishContent from "../PublishContent/PublishContent";
import {
  checkGenerationLimit,
  incrementGenerationCount,
} from "../../utils/usageLimit";

const CreateFunV1 = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null); // for img-to-video API call
  const [imageObjectKey, setImageObjectKey] = useState<string | null>(null); // to store in db, later use this to get the signed URL to retrieve the image
  const [videoObjectKey, setVideoObjectKey] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const [duration, setDuration] = useState<number>(5);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [remainingGenerations, setRemainingGenerations] = useState<number>(3);

  useEffect(() => {
    const { remaining } = checkGenerationLimit();
    setRemainingGenerations(remaining);
  }, []);

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

  const onGenerate = async () => {
    if (!imageUrl) {
      setError("Please upload an image before generating.");
      return;
    }
    const { canGenerate, remaining } = checkGenerationLimit();
    if (!canGenerate) {
      setError(
        "You've reached your free generation limit. Please contact us for more!"
      );
      return;
    }

    setLoading(true);
    setError("");
    setVideoUrl("memevids/pim.mp4");
    // Increment count only after successful API call
    incrementGenerationCount();
    setRemainingGenerations(remaining - 1);
    setLoading(false);
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
          ) : (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-yellow-800">You&#39;ve reached your free limit</p>
              <a
                href="https://twitter.com/messages/compose?recipient_id=1274973675393961984"
                className="twitter-dm-button text-blue-500 hover:underline mt-2 inline-block"
                data-screen-name="@mvu_goat"
              >
                Message us on X
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
        <OutputVideoBox videoUrl={videoUrl} />
        <PublishContent
          imageObjectKey={imageObjectKey}
          videoObjectKey={videoObjectKey}
          // description={prompt}
          isDisabled={!videoUrl}
        />
      </div>
    </div>
  );
};

export default CreateFunV1;
