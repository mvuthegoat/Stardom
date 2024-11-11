"use client"; // Add this at the top to mark as client component

import React from "react";
import Masonry from "react-masonry-css";
import VideoCard from "../VideoCard/VideoCard";
import styles from "./VideoGrid.module.css";

const sampleVideos = [
  {
    title: "Video 1",
    videoSrc: "../../../memevids/kling_ai5.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
  {
    title: "Video 3",
    videoSrc: "../../../memevids/kling_ai2.mp4",
    likes: 37,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
  {
    title: "Video 1",
    videoSrc: "../../../memevids/meme_dog.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },

  {
    title: "Video 1",
    videoSrc: "../../../memevids/meme_dog.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },

  {
    title: "Video 1",
    videoSrc: "../../../memevids/kling_ai3.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
  {
    title: "Video 3",
    videoSrc: "../../../memevids/kling_ai4.mp4",
    likes: 37,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
  {
    title: "Video 3",
    videoSrc: "../../../memevids/kling_ai4.mp4",
    likes: 37,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
  {
    title: "Video 3",
    videoSrc: "../../../memevids/kling_ai2.mp4",
    likes: 37,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
  {
    title: "Video 1",
    videoSrc: "../../../memevids/meme_dog.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
  {
    title: "Video 1",
    videoSrc: "../../../memevids/kling_ai5.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
  {
    title: "Video 1",
    videoSrc: "../../../memevids/kling_ai1.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },

  {
    title: "Video 1",
    videoSrc: "../../../memevids/kling_ai5.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
  {
    title: "Video 1",
    videoSrc: "../../../memevids/meme_dog.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },

  {
    title: "Video 1",
    videoSrc: "../../../memevids/meme_dog.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },

  {
    title: "Video 1",
    videoSrc: "../../../memevids/meme_dog.mp4",
    likes: 24,
    cryptoAddress: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    themeName: "Doge",
    creators: "Creator 1",
  },
];

const VideoGrid: React.FC = () => {
  const breakpointColumns = {
    default: 5, // More columns by default
    1600: 4,
    1200: 3,
    900: 2,
    600: 1,
  };

  return (
    <div className={styles.gridContainer}>
      <Masonry
        breakpointCols={breakpointColumns}
        className={styles.videoGrid}
        columnClassName={styles.videoColumn}
      >
        {sampleVideos.map((video, index) => (
          <VideoCard
            key={index}
            title={video.title}
            videoSrc={video.videoSrc}
            likes={video.likes}
            cryptoAddress={video.cryptoAddress}
            themeName={video.themeName}
            creators={video.creators}
          />
        ))}
      </Masonry>
    </div>
  );
};

export default VideoGrid;
