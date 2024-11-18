import React, { useRef, useEffect } from "react";
import styles from "./VideoPopup.module.css";
import { FaTimes, FaHeart } from "react-icons/fa";
import { VideoCardProps } from "../VideoCard/VideoCard";

// Omit video_key from VideoCardProps while adding more props
interface VideoPopupProps extends Omit<VideoCardProps, "video_key" | "original_image_key"> {
  onClose: () => void;
  video_url: string;
  original_image_url: string;
}

const VideoPopup: React.FC<VideoPopupProps> = ({
  title,
  video_url,
  original_image_url,
  likes,
  crypto_address,
  meme_origin,
  dex_chart,
  description,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to autoplay the video
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay was prevented:", error);
          // Optional: Show a play button or prompt to start the video
        });
      }
    }

    // Set focus to the popup for accessibility
    if (popupRef.current) {
      popupRef.current.focus();
    }

    // Prevent background scrolling when popup is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-popup-title"
    >
      <div
        className={styles.popup}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        ref={popupRef}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close Popup"
        >
          <FaTimes />
        </button>
        <div className={styles.content}>
          <div className={styles.videoSection}>
            <video
              ref={videoRef}
              src={video_url}
              className={styles.video}
              controls
              autoPlay
              // muted // Uncomment if you want the video to start muted
            />
          </div>
          <div className={styles.detailsSection}>
            <h2 className={styles.title} id="video-popup-title">
              {title}
            </h2>
            <div className={styles.info}>
              <div className={styles.likes}>
                <FaHeart className={styles.heartIcon} />
                <span>{likes} Likes</span>
              </div>
              <div className={styles.detailItem}>
                <strong>Description:</strong> {description}
              </div>
              <div className={styles.detailItem}>
                <strong>Crypto Address:</strong> {crypto_address}
              </div>
              <div className={styles.detailItem}>
                <strong>Original Meme:</strong> {meme_origin}
              </div>
              {/* <div className={styles.detailItem}>
                <strong>Creator:</strong> {creator_name}
              </div> */}
              <div className={styles.detailItem}>
                <strong>Trade on:</strong> {dex_chart}
              </div>
            </div>
            {/* <button className={styles.actionButton} onClick={onClose}>
              Close
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
