"use client";

import React from "react";
import { poppins, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";
import Footer from "@/components/footer";
import ConditionalNavbar from "@/components/conditional-navbar";
import { HighlightsProvider } from "@/contexts/HighlightsContext";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${poppins.variable} ${jetbrainsMono.variable}`}>
            <body>
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
