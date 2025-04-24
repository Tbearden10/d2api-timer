"use client";

import "./globals.css";
import { ReactNode, useEffect } from "react";
import Footer from "../components/Footer";
import BackgroundCanvas from "../components/BackgroundCanvas";

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Generate a random color
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    document.body.style.backgroundColor = `#${randomColor.padStart(6, "0")}`;
  }, []);

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
      </body>
    </html>
  );
}