"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { MemeStats } from "@/types/memeTypes";
import { useEffect, useState } from "react";

export interface MemecoinResultsProps {
  results: MemeStats[];
}

export const MemecoinResults = ({ results }: MemecoinResultsProps) => {
  const [coinData, setCoinData] = useState<
    Record<
      string,
      { name: string; price: number; marketCap: number; imageUrl: string }
    >
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCoinData = async () => {
      const data: Record<
        string,
        { name: string; price: number; marketCap: number; imageUrl: string }
      > = {};

      for (const meme of results) {
        try {
          const response = await fetch(
            `/api/coingecko-getcoinDataFromAddress/${meme.crypto_address}`
          );
          if (response.ok) {
            // console.log("SUCCESSSSSS COINGECKO!!!");
            const resData = await response.json();
            data[meme.crypto_address] = {
              name: resData.name,
              price: resData.market_data?.current_price?.usd || 0,
              marketCap: resData.market_data?.market_cap?.usd || 0,
              imageUrl: resData.image.large,
            };
          } else {
            console.error(`Failed to fetch data for ${meme.crypto_address}`);
            const errorData = await response.json();
            const errorMessage =
              errorData?.details ||
              "An unexpected error from fetching memecoins data";
            setError(errorMessage);
          }

          setCoinData(data);
        } catch (error: any) {
          console.error(
            `Error fetching data for ${meme.crypto_address}:`,
            error
          );
          setError(`Error fetching data for ${meme.crypto_address}:`);
        } finally {
          setLoading(false); // Ensure the loading state is updated
        }
      }
    };
    fetchCoinData();
  }, [results]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No memecoins found matching your search
      </div>
    );
  }

  if (loading) {
    // While loading, show nothing or a loading spinner
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 py-4">
      {results.map((meme) => {
        // Access fetched coin data for the current crypto_address
        const name = coinData[meme.crypto_address]?.name || "";
        const price = coinData[meme.crypto_address]?.price || 0;
        const marketCap = coinData[meme.crypto_address]?.marketCap || 0;
        const imageUrl = coinData[meme.crypto_address]?.imageUrl;
        const validImageUrl =
          typeof imageUrl === "string" ? imageUrl : "/images/unavailable.jpg"; // placeholder image

        return (
          <Card
            key={name}
            className="bg-white hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
          >
            <CardContent className="p-4 flex items-center gap-3">
              {/* Image container */}
              <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={validImageUrl}
                  alt={name}
                  fill
                  className="rounded-md object-cover" // Add rounded corners for a polished look
                />
              </div>
              {/* Content container */}
              <div className="min-w-0 flex-grow">
                <h3 className="font-medium text-sm truncate">{name}</h3>
                <div className="space-y-0.5 mt-1">
                  <div className="flex items-center text-xs">
                    <span className="text-gray-500 w-[40px]">Price:</span>
                    <span className="font-medium">{formatPrice(price)}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-gray-500 w-[40px]">MCap:</span>
                    <span className="font-medium">
                      {formatMarketCap(marketCap)}
                    </span>
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
        );
      })}
    </div>
  );
};

export default MemecoinResults;
