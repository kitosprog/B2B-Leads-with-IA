import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Company Scraper - Lead Generation Tool',
  description: 'Professional B2B lead generation through intelligent web scraping',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
