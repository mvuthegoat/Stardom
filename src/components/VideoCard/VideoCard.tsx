"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./VideoCard.module.css";
import VideoPopup from "../VideoPopup/VideoPopup";
import { Video } from "@/types/videoTypes";

export type VideoCardProps = Omit<Video, 'thumbnail_url'>;

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  video_url,
  likes,
  crypto_address,
  meme_origin,
  creator_name,
  dex_chart,
  description,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const delayRef = useRef<number | null>(null); // Ref to store timeout ID

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
          <video
            ref={videoRef}
            src={video_url}
            className={styles.video}
            muted
            loop
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>
      </div>
      {showPopup && (
        <VideoPopup
          id={id}
          title={title}
          video_url={video_url}
          likes={likes}
          crypto_address={crypto_address}
          meme_origin={meme_origin}
          creator_name={creator_name}
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
