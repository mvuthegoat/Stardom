"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Navbar,
  UploadBox,
  PromptBox,
  ConfigButton,
  GenerateButton,
  OutputVideoBox,
  PageLayout,
} from "../../components";
import styles from "./CreateFun.module.css";
import PostButton from "../PostButton/PostButton";

import { useRouter } from "next/navigation";
import { useWallet } from "@/components/Wallet/WalletContext";
import { WalletConnectModal } from "@/components/Wallet/WalletConnectModal";

const CreateFun = () => {
  const router = useRouter();
  const { account } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const [image, setImage] = useState<File | null>(null);

  const [prompt, setPrompt] = useState<string>("");
  const [duration, setDuration] = useState<number>(5);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // If user is not connected, show wallet modal
    if (!account) {
      setShowWalletModal(true);
    }
  }, [account]);

  const handleWalletSuccess = () => {
    // User successfully connected wallet
    console.log("SUCESSFULLY connected to wallet");
    console.log(account);
    setShowWalletModal(false);
  };

  const handleWalletClose = () => {
    // If user closes modal without connecting, redirect to home
    console.log("Close Wallet");
    if (!account) {
      console.log("NO ACCOUNT CONNECTED!");
      router.push("/have-fun");
      return;
    } 
    setShowWalletModal(false);
    router.push("/create-fun");
  };

  const onGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      formData.append("prompt", prompt);
      formData.append("duration", duration.toString());

      setVideoUrl("../../memevids/meme_dog.mp4");
      //   const response = await generateVideo(formData);
      //   setVideoUrl(response.data.videoUrl);
      //   console.log("Generated Video URL:", response.data.videoUrl);
      //   console.log("Generating video with:", {
      //     prompt,
      //     image,
      //     duration,
      //     response,
      //   });
    } catch (err) {
      setError("Failed to generate video. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.createFunContainer}>
        <div className={styles.inputSection}>
          <UploadBox setImage={setImage} />
          <PromptBox prompt={prompt} setPrompt={setPrompt} />
          <ConfigButton duration={duration} setDuration={setDuration} />
          <GenerateButton onGenerate={onGenerate} />
          {loading && <p>Generating your video... please wait!</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
        <div className={styles.outputSection}>
          <OutputVideoBox videoUrl={videoUrl} />
          <PostButton videoUrl={videoUrl} />
        </div>
      </div>

      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={handleWalletClose}
        onSuccess={handleWalletSuccess}
      />
    </>
  );
};

export default CreateFun;
