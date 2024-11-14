import { PageLayout, VideoGrid } from "../../../components";

interface CategoryPageProps {
  params: {
    categoryName: string;
  };
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
