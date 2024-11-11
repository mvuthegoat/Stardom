import React from "react";
import { PageLayout, VideoGrid } from "../../../components";

interface AssetCollectionPageProps {
  params: {
    collectionName: string;
  };
}

const AssetCollectionPage: React.FC<AssetCollectionPageProps> = ({
  params,
}) => {
  const { collectionName } = params;

  return (
    <>
      <h2>Collection: {collectionName}</h2>
      <VideoGrid />
    </>
  );
};

export default AssetCollectionPage;
