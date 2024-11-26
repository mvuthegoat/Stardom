"use client";

import React, { useRef, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Heart, Download, Copy, Check } from "lucide-react";
import { VideoCardProps } from "../VideoCard/VideoCard";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface VideoPopupProps extends VideoCardProps {
  onClose: () => void;
  video_url?: string;
  original_image_url?: string;
}

const VideoPopup: React.FC<VideoPopupProps> = ({
  // id,  // For future use to interact with the database to increment likes
  title,
  video_url,
  original_image_url,
  video_key, // For download purpose
  original_image_key,
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
  const isStaticImage = !video_key;

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
      // Determine which key to use for download
      const isStaticImage = !video_key;
      const objectKey = isStaticImage ? original_image_key : video_key;

      if (!objectKey) {
        throw new Error("No media key available for download");
      }

      // Fetch the S3 signed URL from your API
      const response = await fetch("/api  /get-media-url-permanent-bucket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectKey }), // Pass the appropriate key
      });

      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }

      const { mediaUrl } = await response.json();

      // Determine file extension and create appropriate filename
      const originalFilename = objectKey.split("/").pop() || "";
      let filename = originalFilename;

      // If no extension in filename, add appropriate extension based on content type
      if (!filename.includes(".")) {
        filename = isStaticImage ? `${filename}.jpg` : `${filename}.mp4`;
      }

      // Fetch the file content
      const fileResponse = await fetch(mediaUrl);

      // Get content type from response
      const contentType = fileResponse.headers.get("content-type");

      // Create appropriate extension based on content type if filename doesn't have one
      if (!filename.includes(".")) {
        const extension = getExtensionFromContentType(contentType);
        filename = `${filename}${extension}`;
      }

      const blob = await fileResponse.blob();

      // Create and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;

      // Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      // You might want to add a toast notification or other user feedback here
    }
  };

  // Helper function to determine file extension from content type
  const getExtensionFromContentType = (contentType: string | null): string => {
    if (!contentType) return ".bin";

    const extensionMap: { [key: string]: string } = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
      "video/quicktime": ".mov",
    };

    return extensionMap[contentType] || ".bin";
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
          {isStaticImage ? (
            <div className="relative w-full h-full">
              <Image
                src={original_image_url || ''}
                alt="Media content"
                fill
                sizes="60vw"
                priority
                className="rounded-3xl object-contain"
                style={{ backgroundColor: 'black' }}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={video_url}
              className="w-full h-full object-contain rounded-3xl"
              controls
              autoPlay
            />
          )}
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
                <span className="text-sm font-medium">
                  {likes ? likes : ""}
                </span>
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
            <h2 className="text-2xl font-bold" id="video-popup-title">
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
                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={() => router.push(`/meme/${crypto_address}`)}
                      className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-s font-medium transition-all duration-200 flex items-center gap-1"
                    >
                      Trade this
                      <span className="text-green-600 opacity-75">
                        (coming soon!)
                      </span>
                    </button>
                  </div>
                </div>{" "}
                <div className="flex items-center">
                  <span className="text-gray-500 w-32">See on DEX:</span>
                  {dex_chart ? (
                    <a
                      href={dex_chart}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-blue-500">Empty</span>
                  )}
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
