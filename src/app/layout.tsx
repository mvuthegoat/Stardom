"use client"; 

import React from "react";
import PageLayout from "../components/PageLayout/PageLayout";
import "./globals.css"; 
import { usePathname } from "next/navigation";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const showTabs = pathname.startsWith("/have-fun");

  return (
    <html lang="en">
      <head>{/* Meta tags, fonts, etc. */}</head>
      <body>
        <PageLayout showTabs={showTabs}>{children}</PageLayout>
      </body>
    </html>
  );
};

export default RootLayout;
