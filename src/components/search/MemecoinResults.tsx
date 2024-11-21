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

  useEffect(() => {
    const fetchCoinData = async () => {
      const data: Record<
        string,
        { name: string; price: number; marketCap: number; imageUrl: string }
      > = {};

      // Fetch data for all crypto addresses concurrently
      const fetchPromises = results.map((meme) =>
        fetch(`/api/coingecko-getcoinDataFromAddress/${meme.crypto_address}`)
          .then(async (response) => {
            if (response.ok) {
              const resData = await response.json();
              // Store the fetched data in a format indexed by the crypto address
              return {
                crypto_address: meme.crypto_address,
                name: resData.name,
                price: resData.market_data?.current_price?.usd || 0,
                marketCap: resData.market_data?.market_cap?.usd || 0,
                imageUrl: resData.image.large,
              };
            } else {
              const errorData = await response.json();
              console.error(
                `Failed to fetch data for ${meme.crypto_address}:`,
                errorData?.details || "Unknown error"
              );
              return null; // Skip invalid addresses
            }
          })
          .catch((error) => {
            console.error(
              `Error fetching data for ${meme.crypto_address}:`,
              error
            );
            return null; // Skip invalid addresses
          })
      );

      const resolvedResults = await Promise.allSettled(fetchPromises);

      // Process the results to build the `coinData` object
      // coinData object only stores coins that are successfully returned by API
      // we ignore all failed coins
      resolvedResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const { crypto_address, ...coinInfo } = result.value;
          data[crypto_address] = coinInfo;
        }
      });

      // Update state with the filtered data
      setCoinData(data);
      setLoading(false);
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
      {Object.entries(coinData).map(    // Iterate over a list of successfully fetched coins only!
        ([crypto_address, { name, price, marketCap, imageUrl }]) => {
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
                  href={`/meme/${encodeURIComponent(crypto_address)}`}
                  className="flex-shrink-0 text-sm font-medium text-white bg-black px-4 rounded-full hover:bg-gray-900 transition-colors duration-200 h-[40px] flex items-center justify-center ml-2"
                >
                  View
                </Link>
              </CardContent>
            </Card>
          );
        }
      )}
    </div>
  );
};

export default MemecoinResults;
