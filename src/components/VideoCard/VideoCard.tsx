"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./VideoCard.module.css";
import VideoPopup from "../VideoPopup/VideoPopup";
import { Video } from "../../types/videoTypes";
import Image from "next/image"; 

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
  const delayRef = useRef<number | null>(null);

  const isStaticImage = !video_key;
  const isVideoOnly = !original_image_key && video_key;

  useEffect(() => {
    const fetchMediaUrls = async () => {
      try {
        // Fetch URLs based on content type
        const promises = [];

        if (video_key) {
          promises.push(
            fetch(
              `/api/get-media-url-video-card?object_key=${video_key}&type=video`
            )
          );
        }

        if (original_image_key) {
          promises.push(
            fetch(
              `/api/get-media-url-video-card?object_key=${original_image_key}&type=image`
            )
          );
        }

        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map((r) => r.json()));

        if (video_key) {
          setVideoUrl(data[0].video_url);
        }
        if (isVideoOnly) return;
        setOriginalImageUrl(data[isStaticImage ? 0 : 1].image_url);
      } catch (error) {
        console.error("Error fetching media URLs:", error);
      }
    };

    if (video_key || original_image_key) {
      fetchMediaUrls();
    }
  }, [video_key, original_image_key, isStaticImage, isVideoOnly]);

  // Video-specific handlers
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = video.duration;
      setIsLoaded(true);
    }
  };

  const handleMouseEnter = () => {
    if (!isStaticImage) {
      const video = videoRef.current;
      if (video && isLoaded) {
        video.currentTime = 0;
        video.pause();

        delayRef.current = window.setTimeout(() => {
          video.play().catch((error) => {
            console.warn("Video play interrupted", error);
          });
        }, 300);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isStaticImage) {
      const video = videoRef.current;
      if (video && isLoaded) {
        video.pause();

        if (delayRef.current !== null) {
          clearTimeout(delayRef.current);
          delayRef.current = null;
        }

        video.currentTime = video.duration;
      }
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
      <div className={styles.videoCardContainer}>
        <div
          className={styles.videoCard}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <div className={styles.videoWrapper}>
            {isStaticImage ? (
              originalImageUrl ? (
                <div className={styles.imageContainer}>
                  {" "}
                  {/* Add this wrapper div */}
                  <Image
                    src={originalImageUrl}
                    alt={title}
                    width={400} // Set a reasonable fixed width for the card
                    height={400} // Same height for square boundary
                    className={styles.image}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <div>Loading...</div>
              )
            ) : videoUrl ? (
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
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <h3 className={styles.videoTitle}>{title}</h3>
        </div>
      </div>
      {showPopup && (
        <VideoPopup
          id={id}
          title={title}
          video_url={videoUrl || ""}
          video_key={video_key}
          original_image_url={originalImageUrl || ""}
          original_image_key={original_image_key}
          likes={likes}
          crypto_address={crypto_address}
          meme_origin={meme_origin}
          dex_chart={dex_chart}
          description={description}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
};

export default VideoCard;
