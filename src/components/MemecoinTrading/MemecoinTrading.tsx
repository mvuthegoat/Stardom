"use client";

import React from "react";
import styles from "./MemecoinTrading.module.css";
import { TrendingUp, DollarSign, Droplet, PieChart } from "lucide-react";
import Image from "next/image";

interface MemecoinTradingProps {
  poolInfo: {
    poolId: string;
    tokenLogo: string;
    tokenSymbol: string;
    tokenName: string;
  };
  imageUrl: string;
}

export default function MemecoinTrading({
  poolInfo,
  imageUrl,
}: MemecoinTradingProps) {
  return (
    <div className={styles.container}>
      {/* Left Section */}
      <aside className={styles.sidebar}>
        <div className={styles.memeCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={poolInfo.tokenSymbol}
              className={styles.memeImage}
              // layout="intrinsic"
              width={500} /* Example width */
              height={500} /* Example height */
              quality={100} // Highest quality
            />
          </div>

          <h1 className={styles.memeName}>{poolInfo.tokenName}</h1>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <DollarSign className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Price</span>
                <span className={styles.statValue}>$1.12</span>
              </div>
            </div>

            <div className={styles.statItem}>
              <Droplet className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Liquidity</span>
                <span className={styles.statValue}>$3.1M</span>
              </div>
            </div>

            <div className={styles.statItem}>
              <PieChart className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Market Cap</span>
                <span className={styles.statValue}>$2.2B</span>
              </div>
            </div>

            <div className={styles.statItem}>
              <TrendingUp className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statLabel}>24h Volume</span>
                <span className={styles.statValue}>$892K</span>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.buyButton}>Buy</button>
            <button className={styles.sellButton}>Sell</button>
          </div>
        </div>
      </aside>

      {/* Right Section */}
      <main className={styles.mainContent}>
        <iframe
          height="95%"
          width="100%"
          id="geckoterminal-embed"
          title="GeckoTerminal Embed"
          src={`https://www.geckoterminal.com/solana/pools/${poolInfo.poolId}?embed=1&info=0&swaps=0`}
          style={{
            border: "10px solid", // Light gray border
            borderRadius: "12px", // Rounded corners
            display: "block",
          }}
          allow="clipboard-write"
          allowFullScreen
        />
      </main>
    </div>
  );
}
