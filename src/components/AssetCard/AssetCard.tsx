"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./AssetCard.module.css";
import slugify from "slugify";

export interface Asset {
  id: number;
  name: string;
  imageUrl: string;
  marketCap: number;
  likes: number;
}

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const router = useRouter();

  const handleClick = () => {
    const slug = slugify(asset.name, { lower: true });
    router.push(`/collection/${slug}`);
  };

  return (
    <div className={styles.assetCard} onClick={handleClick}>
      <div className={styles.imageWrapper}>
        <img src={asset.imageUrl} alt={asset.name} className={styles.image} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{asset.name}</h3>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.label}>Market Cap</span>
            <span className={styles.value}>
              ${asset.marketCap.toLocaleString()}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>Likes</span>
            <span className={styles.value}>{asset.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
