import Footer from "../components/Footer";

export const metadata = {
  title: 'Bungie API Integration',
  description: 'A simple Bungie API integration app using Next.js App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}