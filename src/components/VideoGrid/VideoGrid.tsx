"use client";

import React from "react";
import Masonry from "react-masonry-css";
import VideoCard from "../VideoCard/VideoCard";
import { Video } from "@/types/videoTypes";
import styles from "./VideoGrid.module.css";

interface VideoGridProps {
  videos: Video[];
  title?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos = [], title }) => {
  // console.log("VIDEO GRID", videos);
  return (
    <div className={styles.gridContainer}>
      {title && <h2 className={styles.gridTitle}>{title}</h2>}
      <Masonry
        breakpointCols={{ default: 5, 1600: 4, 1200: 3, 900: 2, 600: 1 }}
        className={styles.videoGrid}
        columnClassName={styles.videoColumn}
      >
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </Masonry>
    </div>
  );
};

export default VideoGrid;
