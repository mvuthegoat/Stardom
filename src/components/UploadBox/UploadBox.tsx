"use client";

import React, { useState } from "react";
import styles from "./UploadBox.module.css";

interface UploadBoxProps {
  onFileSelect: (file: File | null) => void; // Callback for selected file
}

const UploadBox: React.FC<UploadBoxProps> = ({ onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Generate a local preview
      setPreview(URL.createObjectURL(file));

      // Upload the image to S3 and get the URL
      // try {
      //   const tempImageData = await uploadFileToS3(file);
      //   const {mediaUrl, objectKey} = tempImageData;
      //   setImageUrl(mediaUrl);  // This is the presigned URL
      //   setImageObjectKey(objectKey);

      // } catch (error) {
      //   console.error("Error uploading image:", error);
      //   // Handle error (e.g., show a message to the user)
      // }

      // Pass the selected file to the parent
      onFileSelect(file);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    onFileSelect(null);
    // Optionally, delete the image from S3
  };

  return (
    <div className={styles.uploadBox}>
      {preview ? (
        <div className={styles.previewContainer}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
          <button className={styles.deleteButton} onClick={handleDelete}>
            🗑️
          </button>
        </div>
      ) : (
        <label htmlFor="file-upload" className={styles.uploadLabel}>
          Select Asset
        </label>
      )}
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
    </div>
  );
};

export default UploadBox;
