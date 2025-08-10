import React from "react";
import {poppins} from "@/lib/fonts"
import "./globals.css";
import Footer from "@/components/footer";
import ConditionalNavbar from "@/components/conditional-navbar"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
      <ConditionalNavbar />
      {children}
      <div id="footer">
          <Footer />
      </div>
      </body>
    </html>
  );
}
