import React from "react";
import styles from "./GenerateButton.module.css";

interface GenerateButtonProps {
  onGenerate: () => void; 
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onGenerate }) => {
  return (
    <button onClick={onGenerate} className={styles.generateButton}>
      Generate
    </button>
  );
};

export default GenerateButton;
