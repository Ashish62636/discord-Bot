"use client";

import React, { useState } from "react";
import { inter, spaceGrotesk, jetbrainsMono } from "@/lib/fonts";
import { NavigationRail } from "@/components/layout/NavigationRail";
import { TopHeader } from "@/components/layout/TopHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { GuildProvider } from "@/hooks/use-guild";
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
        <GuildProvider>
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
              <main className="flex-1 overflow-y-auto bg-[linear-gradient(rgba(120,150,215,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(120,150,215,.035)_1px,transparent_1px),radial-gradient(circle_at_78%_-12%,rgba(147,129,255,.14),transparent_28rem)] bg-[size:28px_28px,28px_28px,auto] bg-background flex flex-col">
                {children}
              </main>
            </div>
          </div>
        </GuildProvider>
      </body>
    </html>
  );
}
