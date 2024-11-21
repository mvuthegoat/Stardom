"use client";

import React from "react";
import styles from "./OutputVideoBox.module.css";
import { v4 as uuidv4 } from "uuid";

interface OutputVideoBoxProps {
  videoUrl: string | null;
  onDelete?: () => void;
}

const OutputVideoBox: React.FC<OutputVideoBoxProps> = ({
  videoUrl,
  onDelete,
}) => {
  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      // Fetch the video file
      const response = await fetch(videoUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch the video file.");
      }

      // Create a Blob from the response
      const blob = await response.blob();
      // Generate a random UUID-based filename
      const fileName = `${uuidv4()}_generated_video.mp4`;
      // Create a URL for the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName; // Set the filename

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Revoke the Blob URL
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className={styles.outputVideoBox}>
      {videoUrl ? (
        <>
          <video controls src={videoUrl} className={styles.videoPlayer} />
          <button onClick={handleDelete} className={styles.deleteButton}>
            🗑️
          </button>
          <button onClick={handleDownload} className={styles.downloadButton}>
            ⬇️
          </button>
        </>
      ) : (
        <div className={styles.placeholder}>
          <p>Generations will appear here</p>
        </div>
      )}
    </div>
  );
};

export default OutputVideoBox;
