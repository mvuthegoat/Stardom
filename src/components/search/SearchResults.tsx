"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Adjust based on your Next.js version
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
  const router = useRouter(); // Initialize the router

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

  // Handler for clearing the search
  const handleClearSearch = () => {
    router.push("/have-fun");
  };

  return (
    <main className="min-h-screen p-4">
      <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Container for the "Showing results" text and "Clear Search" button */}
      <div className="mt-4 flex items-center space-x-5">
        <span className="text-gray-700">
          Showing results for: <strong>{decodedQuery}</strong>
        </span>
        <button
          onClick={handleClearSearch}
          className="text-blue-500 hover:underline text-sm px-2 py-1 border border-blue-500 rounded"
        >
          Clear Search
        </button>
      </div>

      {/* Results Section */}
      <div className="mt-4">
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
