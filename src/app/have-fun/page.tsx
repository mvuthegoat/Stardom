"use client";

import React, { useEffect, useState } from "react";
import { VideoGrid } from "@/components";
import { Video } from "@/types/videoTypes";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchDiscoveryFeed } from "../../services/videoData";

const HaveFunPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 10; // Number of videos to fetch per request

  // Function to load videos from the backend
  const loadVideos = async (currentPage: number): Promise<Video[]> => {
    try {
      const fetchedVideos = await fetchDiscoveryFeed(currentPage, limit);
      return fetchedVideos;
    } catch (err) {
      console.error("Error loading videos:", err); // Log the error
      throw new Error("Failed to load videos.");
    }
  };

  // Function to fetch more videos and update state
  const fetchMoreVideos = async () => {
    try {
      const newVideos = await loadVideos(page);
      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      setHasMore(newVideos.length === limit); // If fewer than 'limit', no more videos
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load more videos.");
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchMoreVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchMoreVideos}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        // endMessage={
        //   <p style={{ textAlign: "center" }}>
        //     <b>You have seen all the videos!</b>
        //   </p>
        // }
        // Optionally, add styling to ensure Masonry layout works correctly
        // style={{ overflow: "visible" }}
      >
        <VideoGrid videos={videos} />
      </InfiniteScroll>
    </div>
  );
};

export default HaveFunPage;
