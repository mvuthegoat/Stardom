"use client";

// MobileWarning.tsx
import React, { useState, useEffect } from "react";

const MobileWarning = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <>
      {/* Interaction blocker overlay - now with pointer-events-none on specific elements */}
      <div
        className="fixed inset-0 bg-transparent z-40"
        onClick={(e) => {
          // Only prevent clicks, not scrolling
          const target = e.target as HTMLElement;
          // Allow scrolling on the main content areas
          if (!target.closest("button") && !target.closest("a")) {
            return;
          }
          e.preventDefault();
        }}
        style={{
          touchAction: "pan-y", // Allow vertical scrolling
          pointerEvents: "auto", // Enable pointer events for click blocking
        }}
      />
      {/* Warning banner - now with pointer-events-auto to ensure it's interactive */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 animate-slide-up pointer-events-auto">
        <div className="text-center space-y-3">
          <h3 className="font-semibold text-lg">💻 Desktop Version Required</h3>
          <p className="text-gray-600 text-sm">
            Please visit us on desktop for full access to our app.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-500">
              📱✨ Mobile version coming soon!
            </p>
            <a
              href="https://twitter.com/messages/compose?recipient_id=1274973675393961984"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full text-sm font-medium transition-colors shadow-sm"
              data-screen-name="@mvu_goat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Message us on X for more information
            </a>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default MobileWarning;
