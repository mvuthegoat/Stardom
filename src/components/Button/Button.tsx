// Button.tsx
import React from "react";
import styles from "./Button.module.css";
import classNames from 'classnames';
import Link from 'next/link';

interface ButtonProps {
    btnName?: string;
    path: string;
    icon?: React.ReactNode;
    active?: boolean; // Indicates if the button is active
}

const Button: React.FC<ButtonProps> = ({ btnName, path, icon, active = false }) => {
    return (
        <div className={styles.box}>
            <Link
                href={path}
                className={classNames(styles.button, { [styles.active]: active })}
                aria-current={active ? "page" : undefined} // For accessibility
            >
                {icon && <span className={styles.icon}>{icon}</span>}
                {btnName}
            </Link>
        </div>
    );
};

export default Button;
