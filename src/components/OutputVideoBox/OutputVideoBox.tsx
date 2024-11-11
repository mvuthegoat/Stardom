import React from "react";
import styles from "./OutputVideoBox.module.css";

interface OutputVideoBoxProps {
  videoUrl: string | null;
}

const OutputVideoBox: React.FC<OutputVideoBoxProps> = ({ videoUrl }) => {
  return (
    <div className={styles.outputVideoBox}>
      {videoUrl ? (
        <video controls src={videoUrl} className={styles.videoPlayer} />
      ) : (
        <div className={styles.placeholder}>
          <p>Generations will appear here</p>
        </div>
      )}
    </div>
  );
};

export default OutputVideoBox;
