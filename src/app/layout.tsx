import './globals.css';
import SnowBackground from '../components/SnowBackground';

export const metadata = {
  title: 'Bungie API Integration',
  description: 'A simple Bungie API integration app using Next.js App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SnowBackground />
        <main>{children}</main>
      </body>
    </html>
  );
}

