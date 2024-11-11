'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Tabs.module.css";
import { tabsConfig } from "./TabsConfig";

const Tabs: React.FC = () => {
  const pathname = usePathname();

  // Determine the active tab by matching the current pathname with the tab paths
  const activeTabPath = tabsConfig.find((tab) => pathname === tab.path)?.path;

  return (
    <div className={styles.tabsContainer}>
      {tabsConfig.map((tab) => (
        <Link href={tab.path} key={tab.path} passHref>
          <div
            className={`${styles.tab} ${
              activeTabPath === tab.path ? styles.active : ""
            }`}
          >
            {tab.label}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Tabs;
