"use client";

import React, { useRef, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Heart, Download, Copy, Check } from "lucide-react";
import { VideoCardProps } from "../VideoCard/VideoCard";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

interface VideoPopupProps extends Omit<VideoCardProps, "original_image_key"> {
  onClose: () => void;
  video_url: string;
  original_image_url?: string;
}

// interface VideoPopupProps {
//   title: string;
//   video_url: string;
//   likes: number;
//   crypto_address: string;
//   meme_origin: string;
//   dex_chart: string;
//   description: string;
//   onClose: () => void;
// }

const VideoPopup: React.FC<VideoPopupProps> = ({
  // id,  // For future use to interact with the database to increment likes
  title,
  video_url,
  video_key, // For download purpose
  likes: initialLikes,
  crypto_address,
  meme_origin,
  dex_chart,
  description,
  onClose,
}) => {
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay was prevented:", error);
        });
      }
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLike = async () => {
    const newIsLiked = !isLiked; // Toggle like state
    setIsLiked(newIsLiked);
    setLikes((prev) => (newIsLiked ? prev + 1 : prev - 1));
  };

  const handleDownload = async () => {
    try {
      // Fetch the S3 signed URL from your API instead of CloudFront
      // Not sure how to configure CloudFront to allow download directly from url
      const response = await fetch("/api/get-media-url-permanent-bucket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectKey: video_key }), // Pass the video key
      });

      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }

      const { mediaUrl } = await response.json();

      // Ensure the filename is provided (extract from mediaUrl or default to video.mp4)
      const filename = video_key.split("/").pop() || "video.mp4";

      // Fetch the file as a Blob
      const fileResponse = await fetch(mediaUrl);
      const blob = await fileResponse.blob();

      // Create a URL for the Blob and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      // Optional: Show a user-friendly error message
    }
  };

  const handleDownloadClick = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    await handleDownload();
    setIsDownloading(false);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(crypto_address || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-popup-title"
    >
      <div
        className="bg-white w-[60vw] h-[85vh] rounded-3xl flex relative shadow-lg outline-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        ref={popupRef}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 z-10"
          onClick={onClose}
          aria-label="Close Popup"
        >
          <FaTimes className="text-2xl" />
        </button>

        <div className="flex-1 bg-black flex justify-center items-center p-4">
          <video
            ref={videoRef}
            src={video_url}
            className="w-full h-full object-contain rounded-3xl"
            controls
            autoPlay
          />
        </div>

        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Top action bar - adjusted width to prevent overlap */}
          <div className="flex items-center justify-between mb-12 pr-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-2"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                  }`}
                />
                <span className="text-sm font-medium">{likes}</span>
              </button>
              <button
                onClick={handleDownloadClick}
                className={`hover:bg-gray-100 rounded-full p-2 transition-all duration-200 group ${
                  isDownloading ? "cursor-wait opacity-70" : ""
                }`}
                disabled={isDownloading}
                aria-label="Download video"
              >
                <Download
                  className={`w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform duration-200 ${
                    isDownloading ? "animate-pulse" : ""
                  }`}
                />
              </button>
            </div>
            <button
              onClick={() => router.push("/create-fun")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-sm font-medium h-[3rem]"
            >
              Tell your story
            </button>
          </div>

          {/* Content section - increased top spacing */}
          <div className="space-y-8 mt-4">
            <h2 className="text-3xl font-bold" id="video-popup-title">
              {title}
            </h2>

            <div className="space-y-6">
              <p className="text-gray-700">{description}</p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-500 w-32">Original Meme:</span>
                  <button
                    onClick={() =>
                      router.push(`/search/${encodeURIComponent(meme_origin)}`)
                    }
                    className="flex items-center gap-2 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-all duration-200 -ml-2"
                  >
                    <span className="font-medium">{meme_origin}</span>
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 w-32">Crypto Address:</span>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm"
                  >
                    <span className="font-mono">
                      {shortenAddress(crypto_address || "")}
                    </span>
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 w-32">Trade on:</span>
                  <a
                    href={dex_chart}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Chart
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
