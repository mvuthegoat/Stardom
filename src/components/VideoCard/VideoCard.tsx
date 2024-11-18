"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./VideoCard.module.css";
import VideoPopup from "../VideoPopup/VideoPopup";
import { Video } from "@/types/videoTypes";

export type VideoCardProps = Omit<Video, "creator_id">;

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  video_key,
  original_image_key,
  likes,
  crypto_address,
  meme_origin,
  dex_chart,
  description,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const delayRef = useRef<number | null>(null); // Ref to store timeout ID

  useEffect(() => {
    const fetchMediaUrls = async () => {
      try {
        // Fetch both video and image URLs in parallel
        const [videoResponse, imageResponse] = await Promise.all([
          fetch(
            `/api/get-media-url-video-card?object_key=${video_key}&type=video`
          ),
          fetch(
            `/api/get-media-url-video-card?object_key=${original_image_key}&type=image`
          ),
        ]);

        const videoData = await videoResponse.json();
        const imageData = await imageResponse.json();

        setVideoUrl(videoData.video_url); // Update the video URL state
        setOriginalImageUrl(imageData.image_url); // Update the image URL state
      } catch (error) {
        console.error("Error fetching media URLs:", error);
      }
    };

    // Trigger fetch only if keys are present
    if (video_key && original_image_key) {
      fetchMediaUrls();
    }

    console.log(videoUrl);
    console.log(originalImageUrl);
  }, [video_key, original_image_key]);

  // Set the last frame as thumbnail when video loads
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      // Set to the last frame
      video.currentTime = video.duration;
      setIsLoaded(true);
    }
  };

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video && isLoaded) {
      video.currentTime = 0; // Seek to the first frame
      video.pause();

      // Start playing after a slight delay (e.g., 500ms)
      delayRef.current = window.setTimeout(() => {
        video.play().catch((error) => {
          console.warn("Video play interrupted", error);
        });
      }, 300); // Adjust the delay as desired
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video && isLoaded) {
      video.pause();

      // Clear any existing delay to prevent it from starting after mouse leaves
      if (delayRef.current !== null) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }

      // Set back to last frame when mouse leaves
      video.currentTime = video.duration;
    }
  };

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div
        className={styles.videoCard}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className={styles.videoWrapper}>
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className={styles.video}
              muted
              loop
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
            />
          ) : (
            <div>Loading...</div> // Placeholder for when videoUrl is not yet defined
          )}
        </div>
      </div>
      {showPopup && (
        <VideoPopup
          id={id}
          title={title}
          video_url={videoUrl || ""}
          original_image_url={originalImageUrl || ""}
          likes={likes}
          crypto_address={crypto_address}
          meme_origin={meme_origin}
          dex_chart={dex_chart}
          description={description}
          onClose={handleClosePopup}
        />
      )}
      <div className={styles.footer}>
        <h3 className={styles.videoTitle}>{title}</h3>
        <span className={styles.likes}>▶ {likes}</span>
      </div>
    </>
  );
};

export default VideoCard;
