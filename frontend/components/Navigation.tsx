'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search, Database } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Search className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">CompanyScraper</span>
            </Link>

            <div className="flex space-x-6">
              <Link
                href="/"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/results"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                  pathname === '/results' ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <Database className="h-4 w-4" />
                Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
