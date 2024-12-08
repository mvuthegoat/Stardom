"use client";

import React, { useState, useEffect } from "react";
import { BarChart2, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TokenData {
  marketCap: string;
  totalVolume: string;
  priceChange24hPercent: string;
  imageUrl: string;
  tokenName: string;
}

interface MemecoinTradingProps {
  poolInfo: {
    poolId: string;
  };
  cryptoAddress: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
};

export default function MemecoinTrading({
  poolInfo,
  cryptoAddress,
}: MemecoinTradingProps) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch(
          `/api/coingecko-getcoinDataFromAddress/${cryptoAddress}`
        );
        if (!response.ok) throw new Error("Failed to fetch token data");
        const resData = await response.json();
        setTokenData({
          marketCap: formatNumber(resData.market_data?.market_cap?.usd || 0),
          totalVolume: formatNumber(
            resData.market_data?.total_volume?.usd || 0
          ),
          priceChange24hPercent: `${(
            resData.market_data?.price_change_percentage_24h || 0
          ).toFixed(2)}%`,
          imageUrl: resData.image?.large || "/images/unavailable.png",
          tokenName: resData.name || "Unknown Token",
        });
      } catch (err) {
        console.error("Error fetching token data:", err);
      }
    };
    fetchTokenData();
  }, [cryptoAddress]);

  return (
    <div className="flex gap-6 p-6 w-full h-screen bg-gray-50">
      {/* Chart Section */}
      <div className="w-2/3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <iframe
          height="85%"
          width="100%"
          id="geckoterminal-embed"
          title="GeckoTerminal Embed"
          src={`https://www.geckoterminal.com/solana/pools/${poolInfo.poolId}?embed=1&info=0&swaps=0`}
          className="rounded-xl"
          style={{ border: "none" }}
          allow="clipboard-write"
          allowFullScreen
        />
      </div>

      {/* Trading and Info Section */}
      <div className="w-1/3 space-y-6">
        {/* Trading Card */}
        <Card className="bg-white rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <Tabs
              defaultValue="buy"
              className="w-full"
              onValueChange={(value) => setActiveTab(value as "buy" | "sell")}
            >
              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-lg">
                <TabsTrigger
                  value="buy"
                  className="rounded-md transition-all duration-200 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger
                  value="sell"
                  className="rounded-md transition-all duration-200 data-[state=active]:bg-red-400 data-[state=active]:text-white"
                >
                  Sell
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Amount ({activeTab === "buy" ? "SOL" : tokenData?.tokenName})
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pr-16 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {activeTab === "buy" ? (
                      <>
                        <img
                          src="/images/solana-icon.png"
                          alt="SOL"
                          className="w-5 h-5 rounded-full"
                        />
                      </>
                    ) : (
                      <>
                        {tokenData?.imageUrl && (
                          <img
                            src={tokenData.imageUrl}
                            alt={tokenData.tokenName}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {activeTab === "buy" ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAmount("0")}
                  >
                    reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAmount("0.1")}
                  >
                    0.1 SOL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAmount("0.5")}
                  >
                    0.5 SOL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAmount("1")}
                  >
                    1 SOL
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAmount("0")}
                  >
                    reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAmount("25")}
                  >
                    25%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAmount("50")}
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAmount("75")}
                  >
                    75%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAmount("100")}
                  >
                    100%
                  </Button>
                </div>
              )}
              <Button
                className={`w-full rounded-lg shadow-sm transition-all duration-200 text-white ${
                  activeTab === "buy"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-400 hover:bg-red-500"
                }`}
              >
                Place Trade
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Token Info Card */}
        <Card className="bg-white rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                <img
                  src={tokenData?.imageUrl}
                  alt={tokenData?.tokenName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {tokenData?.tokenName || "--"}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <BarChart2 className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Market Cap</p>
                  <p className="text-sm font-medium text-gray-800">
                    {tokenData?.marketCap || "--"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="p-1.5 bg-purple-50 rounded-lg">
                  <Activity className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Volume (24h)</p>
                  <p className="text-sm font-medium text-gray-800">
                    {tokenData?.totalVolume || "--"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="p-1.5 bg-green-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Price Change (24h)</p>
                  <p className="text-sm font-medium text-gray-800">
                    {tokenData?.priceChange24hPercent || "--"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
