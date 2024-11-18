// src/app/meme/[memeName]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { VideoGrid } from '@/components';
import { fetchMemeNameVideos } from '@/app/api/videoData';
import styles from './OriginalMemePage.module.css';
import { Video } from '@/types/videoTypes';
import { TrendingUp, DollarSign, Droplet, PieChart } from 'lucide-react';

interface MemeInfo {
  meme_origin: string;
  image: string;
  crypto_address?: string;
  dex_chart?: string;
}

interface OriginalMemePageProps {
  params: Promise<{
    memeName: string;
  }>;
}

export default async function OriginalMemePage({ params }: OriginalMemePageProps) {
  const { memeName } = await params;   
  const fetchedVideos: Video[] = await fetchMemeNameVideos(memeName);

  const memeInfo: MemeInfo | null = fetchedVideos.length > 0
    ? {
        meme_origin: fetchedVideos[0].meme_origin,
        image: fetchedVideos[0].original_image_key,
        crypto_address: fetchedVideos[0].crypto_address,
        dex_chart: fetchedVideos[0].dex_chart,
      }
    : null;

  if (!memeInfo) {
    notFound();
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Left Section */}
      <aside className={styles.sidebar}>
        <div className={styles.memeCard}>
          <div className={styles.imageWrapper}>
            <img 
              src={memeInfo.image} 
              alt={`${memeName} meme`} 
              className={styles.memeImage}
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
            <button className={styles.buyButton}>
              Buy {memeName}
            </button>
            <button className={styles.sellButton}>
              Sell {memeName}
            </button>
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