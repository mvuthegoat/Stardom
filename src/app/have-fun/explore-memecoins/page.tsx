import React from "react";
import styles from "./HaveFunExploreMemecoinsPage.module.css";
import { PageLayout, Slideshow } from "../../../components";

const trendingAssets = [
  {
    id: 1,
    name: "SHIBU",
    imageUrl: "../../../../images/dog_meme.png",
    marketCap: 5000000,
    likes: 1200,
  },
  {
    id: 2,
    name: "PEPE",
    imageUrl: "../../../../images/pepe.jpg",
    marketCap: 3000000,
    likes: 900,
  },
  {
    id: 3,
    name: "FWOG",
    imageUrl: "../../../../images/fwog.jpeg",
    marketCap: 2000000,
    likes: 800,
  },
  {
    id: 4,
    name: "FWOG",
    imageUrl: "../../../../images/fwog.jpeg",
    marketCap: 2000000,
    likes: 800,
  },
  {
    id: 5,
    name: "FWOG",
    imageUrl: "../../../../images/fwog.jpeg",
    marketCap: 2000000,
    likes: 800,
  },
  {
    id: 6,
    name: "FWOG",
    imageUrl: "../../../../images/fwog.jpeg",
    marketCap: 2000000,
    likes: 800,
  },
  {
    id: 7,
    name: "RED WITCH",
    imageUrl: "../../../../images/red-character-meme.jpeg",
    marketCap: 6000000,
    likes: 1500,
  },
];

const mostTradedAssets = [
  {
    id: 3,
    name: "FWOG",
    imageUrl: "../../../../images/fwog.jpeg",
    marketCap: 2000000,
    likes: 800,
  },
  {
    id: 4,
    name: "Wizard LOL",
    imageUrl: "../../../../images/wizard_meme.jpeg",
    marketCap: 1000000,
    likes: 600,
  },
];

const communityFavorites = [
  {
    id: 5,
    name: "Grumpy Pepe",
    imageUrl: "../../../../images/pepe.jpg",
    marketCap: 4000000,
    likes: 1100,
  },
  {
    id: 6,
    name: "RED WITCH",
    imageUrl: "../../../../images/red-character-meme.jpeg",
    marketCap: 6000000,
    likes: 1500,
  },
];

const exploreMetas = [
  {
    id: 7,
    name: "Animal Meta",
    imageUrl: "../../../../images/fwog.jpeg",
    marketCap: 3000000,
    likes: 1000,
  },
  {
    id: 8,
    name: "AI Meta",
    imageUrl: "../../../../images/dog_meme.png",
    marketCap: 2000000,
    likes: 700,
  },
];

const HaveFunThemesPage = () => {
  return (
    <div className={styles.container}>
      <Slideshow
        title="Trending Memecoins"
        assets={mostTradedAssets}
        viewAllLink="/category/most-traded-memecoins"
      />

      <Slideshow
        title="Trending Memes on Stardom"
        assets={trendingAssets}
        viewAllLink="/category/trending-memes"
      />
      <Slideshow
        title="Community Favorites"
        assets={communityFavorites}
        viewAllLink="/category/community-favorites"
      />
      <Slideshow
        title="Explore Metas"
        assets={exploreMetas}
        viewAllLink="/category/explore-metas"
      />
    </div>
  );
};

export default HaveFunThemesPage;
