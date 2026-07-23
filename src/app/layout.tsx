"use client";

import React, { useState } from "react";
import { inter, spaceGrotesk, jetbrainsMono } from "@/lib/fonts";
import { NavigationRail } from "@/components/layout/NavigationRail";
import { TopHeader } from "@/components/layout/TopHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <title>BotHQ — Discord Server Management Dashboard</title>
        <meta
          name="description"
          content="Production-ready Discord Bot Management Dashboard for GuildCraft.gg"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="bg-background text-content-primary font-sans antialiased min-h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden min-h-screen">
          {/* Desktop Left Rail */}
          <NavigationRail />

          {/* Mobile Drawer Navigation */}
          <MobileNav
            isOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />

          {/* Main Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
            <main className="flex-1 overflow-y-auto bg-background flex flex-col">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
