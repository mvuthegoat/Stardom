interface AssetCollectionPageProps {
  params: Promise<{
    collectionName: string;
  }>;
}

const AssetCollectionPage = async ({ params }: AssetCollectionPageProps) => {
  const { collectionName } = await params;

  return (
    <>
      <h2>Collection: {collectionName}</h2>
      {/* <VideoGrid /> */}
    </>
  );
};

export default AssetCollectionPage;
