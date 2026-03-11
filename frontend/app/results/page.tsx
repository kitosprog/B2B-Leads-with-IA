'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { getResults, deleteCompany, type Company } from '@/lib/api';
import { Copy, Trash2, ExternalLink, Download } from 'lucide-react';
import { copyToClipboard, formatDate } from '@/lib/utils';

export default function ResultsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await getResults(100, 0);
      setCompanies(data.companies);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await copyToClipboard(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this company?')) return;

    try {
      await deleteCompany(id);
      setCompanies(companies.filter((c) => c.id !== id));
      setTotal(total - 1);
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Company', 'Website', 'Email', 'Phone', 'LinkedIn', 'Date'];
    const rows = companies.map((c) => [
      c.name,
      c.website,
      c.email || '',
      c.phone || '',
      c.linkedin || '',
      formatDate(c.created_at),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Scraped Companies</h1>
            <p className="text-muted-foreground mt-1">{total} total companies found</p>
          </div>
          <Button onClick={exportToCSV} variant="outline" disabled={companies.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>View and manage your scraped company data</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No companies found yet</p>
                <p className="text-sm text-muted-foreground mt-1">Start a scraping job to see results here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Link
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        {company.email ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{company.email}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(company.email!)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {company.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{company.phone}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(company.phone!)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(company.created_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(company.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
