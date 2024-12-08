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

  return <MemecoinTrading poolInfo={poolInfo} cryptoAddress={cryptoAddress}/>;
}
