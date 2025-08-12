"use client";

import React from "react";
import { poppins } from "@/lib/fonts";
import "./globals.css";
import Footer from "@/components/footer";
import ConditionalNavbar from "@/components/conditional-navbar";
import Preloader from "@/components/preloader";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${poppins.variable}`}>
        <body>
        <Preloader />
        <ConditionalNavbar />
        {children}
        <div id="footer">
            <Footer />
        </div>
        </body>
        </html>
    );
}
