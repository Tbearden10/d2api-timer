import "./globals.css";
import { ReactNode } from "react";
import Footer from "../components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}