"use client";

import React from "react";
import { poppins, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";
import Footer from "@/components/footer";
import ConditionalNavbar from "@/components/conditional-navbar";
import { HighlightsProvider } from "@/contexts/HighlightsContext";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${poppins.variable} ${jetbrainsMono.variable}`}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="preconnect" href="https://unpkg.com" />
                <link rel="preconnect" href="https://prod.spline.design" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <PerformanceOptimizer />
                <HighlightsProvider>
                    <ConditionalNavbar />
                    {children}
                    <div id="footer">
                        <Footer />
                    </div>
                </HighlightsProvider>
            </body>
        </html>
    );
}
