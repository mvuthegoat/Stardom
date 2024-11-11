// Slideshow.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import AssetCard, { Asset } from "../AssetCard/AssetCard";
import styles from "./Slideshow.module.css";

interface SlideshowProps {
  title: string;
  assets: Asset[];
  viewAllLink?: string;
}

const DEFAULT_PAGE_SIZE = 5;
const INITIAL_PAGE = 1;

const Slideshow: React.FC<SlideshowProps> = ({
  title,
  assets,
  viewAllLink,
}) => {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  const totalPages = useMemo(() => {
    return Math.ceil(assets.length / DEFAULT_PAGE_SIZE);
  }, [assets.length]);

  const assetsToRender = useMemo(() => {
    const startIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE;
    return assets.slice(startIndex, startIndex + DEFAULT_PAGE_SIZE);
  }, [currentPage, assets]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || INITIAL_PAGE);
    }
  }, [assets, currentPage, totalPages]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, INITIAL_PAGE));
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className={styles.viewAllLink}>
            View All
          </a>
        )}
      </div>
      <div className={styles.slideshowContainer}>
        <button
          className={styles.navButton}
          onClick={handlePrevPage}
          disabled={currentPage === INITIAL_PAGE}
          aria-label="Previous"
        >
          &#8249;
        </button>
        <div
          className={styles.assetsWrapper}
          style={{ "--page-size": DEFAULT_PAGE_SIZE } as React.CSSProperties}
        >
          {assetsToRender.length > 0 ? (
            assetsToRender.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))
          ) : (
            <div className={styles.emptyState}>No assets available.</div>
          )}
        </div>
        <button
          className={styles.navButton}
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Next"
        >
          &#8250;
        </button>
      </div>
    </section>
  );
};

export default Slideshow;
