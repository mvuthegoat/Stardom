"use client";

import React, { useEffect } from "react";
import styles from "./OutputVideoBox.module.css";

interface OutputVideoBoxProps {
  videoUrl: string | null;
}

const OutputVideoBox: React.FC<OutputVideoBoxProps> = ({ videoUrl }) => {
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
      const fileName = videoUrl.split("/").pop() || "download.mp4";

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

  return (
    <div className={styles.outputVideoBox}>
      {videoUrl ? (
        <>
          <video controls src={videoUrl} className={styles.videoPlayer} />
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
