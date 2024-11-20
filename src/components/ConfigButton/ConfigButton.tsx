import React from 'react';
import styles from './ConfigButton.module.css';

interface ConfigButtonProps {
    duration: number;
    setDuration: (duration: number) => void;
}

const ConfigButton: React.FC<ConfigButtonProps> = ({ duration, setDuration }) => {
    return (
        <div className={styles.configButton}>
            <label>Duration: </label>
            <select 
                value={duration} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDuration(parseInt(e.target.value))}
            >
                <option value={5}>5 seconds</option>
                <option value={10} disabled>10 seconds</option>
            </select>
        </div>
    );
};

export default ConfigButton;
