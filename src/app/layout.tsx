import React from "react";
import "./globals.css";

export const metadata = {
  title: "Bungie API Integration",
  description: "A simple Bungie API integration app using Next.js App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
        <footer>
          Made with ❤️ by belly
        </footer>
      </body>
    </html>
  );
}