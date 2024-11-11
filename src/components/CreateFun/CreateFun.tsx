"use client";

import React from "react";
import { useState } from "react";
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

const CreateFun = () => {
  const [image, setImage] = useState<File | null>(null);

  const [prompt, setPrompt] = useState<string>("");
  const [duration, setDuration] = useState<number>(5);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
      </div>
    </div>
  );
};

export default CreateFun;
