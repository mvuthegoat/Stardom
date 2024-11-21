"use client"; 

import React from "react";
import { PageLayout, ScrollToTopFix } from "../components";
import "./globals.css"; 

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const pathname = usePathname();
  // const showTabs = pathname.startsWith("/have-fun") || pathname.startsWith("/meme");

  return (
    <html lang="en">
      <ScrollToTopFix />
      <head>{/* Meta tags, fonts, etc. */}</head>
      <body>
        <PageLayout showTabs={false}>{children}</PageLayout>
      </body>
    </html>
  );
};

export default RootLayout;
