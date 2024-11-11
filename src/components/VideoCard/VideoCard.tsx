// VideoCard.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./VideoCard.module.css";
import VideoPopup from "../VideoPopup/VideoPopup";

interface VideoCardProps {
  title: string;
  videoSrc: string;
  likes: number;
  cryptoAddress: string;
  themeName: string;
  creators: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  videoSrc,
  likes,
  cryptoAddress,
  themeName,
  creators,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      requestAnimationFrame(() => {
        video.play().catch((error) => {
          console.warn("Video play interrupted", error);
        });
      });
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      requestAnimationFrame(() => {
        video.pause();
        video.currentTime = 0;
      });
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
            src={videoSrc}
            className={styles.video}
            muted
            loop
            preload="metadata"
          />
        </div>
        <div className={styles.info}>
          <p className={styles.title}>{title}</p>
          <p className={styles.likes}>❤️ {likes}</p>
        </div>
      </div>
      {showPopup && (
        <VideoPopup
          title={title}
          videoSrc={videoSrc}
          likes={likes}
          cryptoAddress={cryptoAddress}
          themeName={themeName}
          creators={creators}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
};

export default VideoCard;
