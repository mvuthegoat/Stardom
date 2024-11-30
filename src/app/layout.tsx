"use client";

import React from "react";
import { PageLayout, ScrollToTopFix } from "../components";
import "./globals.css";
import { usePathname } from "next/navigation";
// import { MobileWarning } from "../components";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const showTabs = pathname.startsWith("/create-fun");

  return (
    <html lang="en">
      <ScrollToTopFix />
      <head>{/* Meta tags, fonts, etc. */}</head>
      <body>
        <PageLayout showTabs={showTabs}>{children}</PageLayout>
        {/* <MobileWarning /> */}
      </body>
    </html>
  );
};

export default RootLayout;
