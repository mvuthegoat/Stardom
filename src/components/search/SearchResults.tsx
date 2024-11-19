"use client";

import { useState, useEffect } from "react";
import { SearchTabs } from "@/components";
import { InspirationResults } from "./InspirationResults";
import { MemecoinResults } from "./MemecoinResults";
import { searchInspiration, searchMemecoins } from "@/services/search";
import { Video } from "@/types/videoTypes";
import { MemeStats } from "@/types/memeTypes";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState("inspiration");
  const [isLoading, setIsLoading] = useState(false);
  const [inspirationResults, setInspirationResults] = useState<Video[]>([]);
  const [memecoinResults, setMemecoinResults] = useState<MemeStats[]>([]);
  const decodedQuery = decodeURIComponent(query);

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      try {
        if (activeTab === "inspiration") {
          const data = await searchInspiration(decodedQuery);
          setInspirationResults(data);
        } else {
          const data = await searchMemecoins(decodedQuery);
          setMemecoinResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
        if (activeTab === "inspiration") {
          setInspirationResults([]);
        } else {
          setMemecoinResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [decodedQuery, activeTab]);

  return (
    <main className="min-h-screen p-4">
      <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : activeTab === "inspiration" ? (
          <InspirationResults results={inspirationResults} />
        ) : (
          <MemecoinResults results={memecoinResults} />
        )}
      </div>
    </main>
  );
}
