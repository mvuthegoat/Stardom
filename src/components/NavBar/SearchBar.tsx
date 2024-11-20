"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Clear search value when not on search page
  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setSearchValue("");
    }
  }, [pathname]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = searchValue.trim();
      if (query) {
        router.push(`/search/${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative group">
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search meme(coins)..."
          className="w-full h-12 pl-12 pr-4 bg-gray-100 hover:bg-gray-200 focus:bg-white transition-all duration-200 
            rounded-full border-none text-base placeholder:text-gray-500
            focus:ring-2 focus:ring-black/5 focus:shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          onKeyDown={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Search
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5
            ${isFocused ? "text-gray-900" : "text-gray-500"} 
            transition-colors duration-200`}
        />
      </div>
    </div>
  );
};

export default SearchBar;
