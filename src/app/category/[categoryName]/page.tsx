interface CategoryPageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

const AssetMemePage = async ({ params }: CategoryPageProps) => {
  const { categoryName } = await params;

  return (
    <>
      <h2>Meme: {categoryName}</h2>
      {/* <VideoGrid /> */}
    </>
  );
};

export default AssetMemePage;
