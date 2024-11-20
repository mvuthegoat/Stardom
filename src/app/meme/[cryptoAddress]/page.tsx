import React from "react";
import { notFound } from "next/navigation";
import { VideoGrid } from "@/components";
import { fetchCryptoAddressVideos } from "@/services/videoData";
import styles from "./OriginalMemePage.module.css";
import { Video } from "@/types/videoTypes";
import { TrendingUp, DollarSign, Droplet, PieChart } from "lucide-react";
import Image from "next/image";

interface MemeInfo {
  meme_origin: string;
  image: string;
  dex_chart?: string;
}

interface OriginalMemePageProps {
  params: Promise<{
    cryptoAddress: string;
  }>;
}

export default async function OriginalMemePage({
  params,
}: OriginalMemePageProps) {
  const { cryptoAddress } = await params;
  const fetchedVideos: Video[] = await fetchCryptoAddressVideos(cryptoAddress);

  const memeInfo: MemeInfo | null =
    fetchedVideos.length > 0
      ? {
          meme_origin: fetchedVideos[0].meme_origin,
          image: `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fetchedVideos[0].original_image_key}`,
          dex_chart: fetchedVideos[0].dex_chart,
        }
      : null;

  if (!memeInfo) {
    notFound();
    return null;
  }
  // console.log("MEMEINFO IMAGE URL", memeInfo.image);

  return (
    <div className={styles.container}>
      {/* Left Section */}
      <aside className={styles.sidebar}>
        <div className={styles.memeCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={memeInfo.image}
              alt={`${memeInfo.meme_origin} meme`}
              className={styles.memeImage}
              // layout="intrinsic"
              width={500} /* Example width */
              height={300} /* Example height */
            />
          </div>

          <h1 className={styles.memeName}>{memeInfo.meme_origin}</h1>

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
        <div className={styles.videoGridWrapper}>
          <VideoGrid videos={fetchedVideos} />
        </div>
      </main>
    </div>
  );
}
