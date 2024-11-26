"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./UploadBox.module.css";
import Image from "next/image";

interface UploadBoxProps {
  onFileSelect: (file: File | null) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering dropzone click
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div {...getRootProps()} className={styles.uploadBox}>
      {preview ? (
        <div className={styles.previewContainer}>
          <Image
            src={preview}
            alt="Preview"
            className={styles.previewImage}
            width={100}
            height={100}
          />
          <button className={styles.deleteButton} onClick={handleDelete}>
            🗑️
          </button>
        </div>
      ) : (
        <label htmlFor="file-upload" className={styles.uploadLabel}>
          {isDragActive ? "Drop your image here" : "Upload Your Meme Image"}
        </label>
      )}
      <input {...getInputProps()} className={styles.fileInput} />
    </div>
  );
};

export default UploadBox;
