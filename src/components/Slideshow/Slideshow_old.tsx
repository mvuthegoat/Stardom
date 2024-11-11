"use client";

import React, { useRef } from "react";
import AssetCard, { Asset } from "../AssetCard/AssetCard";
import styles from "./Slideshow.module.css";

interface SlideshowProps {
  title: string;
  assets: Asset[];
  viewAllLink?: string;
}

const Slideshow: React.FC<SlideshowProps> = ({
  title,
  assets,
  viewAllLink,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className={styles.viewAllLink}>
            View All
          </a>
        )}
      </div>
      <div className={styles.scrollContainerWrapper}>
        <button
          className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
          onClick={scrollLeft}
        >
          {"<"}
        </button>
        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
        <button
          className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
          onClick={scrollRight}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Slideshow;
