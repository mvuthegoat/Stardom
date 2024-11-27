import styles from "./PromptBox.module.css";
import React from "react";

interface PromptBoxProps {
  prompt: string | undefined;
  setPrompt: (prompt: string | undefined) => void;
}

const PromptBox: React.FC<PromptBoxProps> = ({ prompt, setPrompt }) => {
  return (
    <div className={styles.promptBox}>
      <textarea
        className={styles.textArea}
        value={prompt || ""}
        onChange={(e) =>
          setPrompt(e.target.value.trim() === "" ? undefined : e.target.value)
        } // Convert empty input back to null
        placeholder={`Prompt to turn your meme image into videos.....\nExample: "Camera shows a green creature, FWOG, going to Mars with his friends"`}
      />
    </div>
  );
};

export default PromptBox;
