import styles from "./PromptBox.module.css";
import React from "react";

interface PromptBoxProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptBox: React.FC<PromptBoxProps> = ({ prompt, setPrompt }) => {
  return (
    <div className={styles.promptBox}>
      <textarea
        className={styles.textArea}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your shot..."
      />
    </div>
  );
};

export default PromptBox;
