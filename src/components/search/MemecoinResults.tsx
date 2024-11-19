import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { MemeStats } from "@/types/memeTypes";

export interface MemecoinResultsProps {
  results: MemeStats[];
}

export const MemecoinResults = ({ results }: MemecoinResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No memecoins found matching your search
      </div>
    );
  }

  const formatPrice = (price: number = 0.25) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number = 1200000000) => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 py-4">
      {results.map((meme) => (
        <Card
          key={meme.meme_origin}
          className="bg-white hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
        >
          <CardContent className="p-4 flex items-center gap-3">
            {/* Image container with fixed dimensions and overflow hidden */}
            <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-sm">
              <Image
                src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${meme.original_image_key}`}
                alt={meme.meme_origin}
                fill
                className="object-cover"
              />
            </div>
            {/* Content container */}
            <div className="min-w-0 flex-grow">
              <h3 className="font-medium text-sm truncate">
                {meme.meme_origin}
              </h3>
              <div className="space-y-0.5 mt-1">
                <div className="flex items-center text-xs">
                  <span className="text-gray-500 w-[40px]">Price:</span>
                  <span className="font-medium">{formatPrice()}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="text-gray-500 w-[40px]">MCap:</span>
                  <span className="font-medium">{formatMarketCap()}</span>
                </div>
              </div>
            </div>

            {/* View button */}
            <Link
              href={`/meme/${encodeURIComponent(meme.crypto_address)}`}
              className="flex-shrink-0 text-sm font-medium text-white bg-black px-4 rounded-full hover:bg-gray-900 transition-colors duration-200 h-[40px] flex items-center justify-center ml-2"
            >
              View
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MemecoinResults;
