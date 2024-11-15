// src/app/layout.tsx
"use client";

import React from "react";
import { PageLayout, ScrollToTopFix } from "@/components";
import "./globals.css";
import { usePathname } from "next/navigation";
import { WalletProvider } from "@/components/Wallet"; // Updated import path

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const showTabs = pathname.startsWith("/have-fun") || pathname.startsWith("/meme");

  return (
    <html lang="en">
      <head />
      <body>
        <WalletProvider>
          <ScrollToTopFix />
          <PageLayout showTabs={showTabs}>{children}</PageLayout>
        </WalletProvider>
      </body>
    </html>
  );
};

export default RootLayout;