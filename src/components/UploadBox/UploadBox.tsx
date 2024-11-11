'use client';

import React, { useState } from "react";
import styles from "./UploadBox.module.css";

interface UploadBoxProps {
  setImage: (file: File | null) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({ setImage }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = () => {
    setImage(null);
    setPreview(null);
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
        className={styles.fileInput} // Ensuring the input is hidden
      />
    </div>
  );
};

export default UploadBox;
