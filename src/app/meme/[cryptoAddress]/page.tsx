import { notFound } from "next/navigation";
import { getTopPool } from "../../../services/cryptoData/getTopPool";
import { MemecoinTrading } from "../../../components";

interface MemecoinTradingPageProps {
  params: Promise<{
    cryptoAddress: string;
  }>;
}

export default async function MemecoinTradingPage({
  params,
}: MemecoinTradingPageProps) {
  const { cryptoAddress } = await params;
  const poolInfo = await getTopPool(cryptoAddress);

  if (!poolInfo) {
    notFound();
  }

  // Fetch image URL because the token logo URI from the API is too small!
  const imageResponse = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/api/get-meme-image-from-address?cryptoAddress=${encodeURIComponent(
      cryptoAddress
    )}`
  );
  const imageData = await imageResponse.json();
  // console.log(imageData);
  const imageUrl = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${imageData.original_image_key}`;

  return <MemecoinTrading poolInfo={poolInfo} imageUrl={imageUrl} />;
}
