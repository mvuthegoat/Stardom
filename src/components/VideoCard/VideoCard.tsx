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
            src={video_url}
            className={styles.video}
            muted
            loop
            preload="metadata"
          />
        </div>
        {/* <div className={styles.info}>
          <p className={styles.title}>{title}</p>
          <p className={styles.likes}>▶ {likes}</p>
        </div> */}
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
