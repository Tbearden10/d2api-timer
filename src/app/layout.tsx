"use client";

import "./globals.css";
import { ReactNode } from "react";
import Footer from "../components/Footer";
import BackgroundCanvas from "../components/BackgroundCanvas";
import { Analytics } from "@vercel/analytics/next"; // <-- import this

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Destiny 2 API Timer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body>
        <BackgroundCanvas />
        <main>{children}</main>
        <Footer />
        <Analytics /> {/* <-- add this line */}
      </body>
    </html>
  );
}
