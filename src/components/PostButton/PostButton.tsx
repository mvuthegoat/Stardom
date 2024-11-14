import React from "react";
import styles from "./PostButton.module.css";

interface PostButtonProps {
  videoUrl: string;
}

const PostButton: React.FC<PostButtonProps> = ({ videoUrl }) => {
  const isDisabled = !videoUrl;

  return (
    <button
      className={`${styles.postButton} ${isDisabled ? styles.disabled : ""}`}
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          alert("Publishing video!");
          // Add publish functionality here
        }
      }}
    >
      Publish
    </button>
  );
};

export default PostButton;
