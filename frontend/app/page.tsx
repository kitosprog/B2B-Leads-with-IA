'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { startScrape, getJob, type ScrapeJob } from '@/lib/api';
import { Search, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { SearchExamples } from '@/components/SearchExamples';

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentJob, setCurrentJob] = useState<ScrapeJob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setIsSubmitting(true);

    try {
      const { id } = await startScrape(query, country || undefined);
      
      const pollJob = setInterval(async () => {
        const { job } = await getJob(id);
        setCurrentJob(job);

        if (job.status === 'completed' || job.status === 'failed') {
          clearInterval(pollJob);
          setIsSubmitting(false);
        }
      }, 2000);

    } catch (error) {
      console.error('Failed to start scrape:', error);
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'success' | 'destructive' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'destructive';
      case 'processing':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Find B2B Leads with AI</h1>
          <p className="text-xl text-muted-foreground">
            Intelligent search and automated scraping of company contact data
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <Search className="h-3 w-3" />
              Automatic Internet Search
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
              ⚡ AI-Powered
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Intelligent Lead Search</CardTitle>
            <CardDescription>
              Describe what you're looking for and our AI will automatically search the internet and extract company data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="query" className="text-sm font-medium flex items-center gap-2">
                  What companies are you looking for?
                  <span className="text-xs text-muted-foreground font-normal">(Natural language)</span>
                </label>
                <Input
                  id="query"
                  placeholder="e.g., software development agencies in Spain"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12 text-base"
                />
                <div className="flex items-start gap-2 mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="mt-0.5">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-xs text-indigo-700">
                    <strong>Deep Search Mode:</strong> We search Google + Bing + DuckDuckGo in parallel, explore company websites deeply (contact pages, about pages, team pages), and extract all available emails and phones.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setQuery('marketing agencies in Madrid')}
                    className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  >
                    💼 Marketing agencies in Madrid
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuery('sustainable fashion brands Barcelona')}
                    className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  >
                    👕 Fashion brands Barcelona
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuery('fintech startups London')}
                    className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  >
                    🚀 Fintech startups London
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuery('consulting firms New York')}
                    className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  >
                    📊 Consulting firms NY
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Target Country (optional)
                </label>
                <Input
                  id="country"
                  placeholder="e.g., Spain, United States, United Kingdom"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  💡 Leave empty to search globally, or specify a country to narrow results
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Start Scraping
                  </>
                )}
              </Button>
            </form>

            {currentJob && (
              <div className="mt-6 p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Job Status</span>
                  <Badge variant={getStatusVariant(currentJob.status)} className="flex items-center gap-1">
                    {getStatusIcon(currentJob.status)}
                    {currentJob.status}
                  </Badge>
                </div>

                {currentJob.status === 'completed' && (
                  <div className="text-sm text-muted-foreground">
                    Found <span className="font-semibold text-foreground">{currentJob.results_count}</span> companies
                  </div>
                )}

                {currentJob.status === 'failed' && currentJob.error_message && (
                  <div className="text-sm text-destructive">{currentJob.error_message}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold">1</div>
                <div className="text-sm text-muted-foreground">Describe Target</div>
                <div className="text-xs text-muted-foreground">Natural language</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Auto Search</div>
                <div className="text-xs text-muted-foreground">Google & more</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">AI Extraction</div>
                <div className="text-xs text-muted-foreground">Emails & phones</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm text-muted-foreground">Export Data</div>
                <div className="text-xs text-muted-foreground">CSV ready</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                How it works
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Enter what you're looking for in <strong>natural language</strong> (e.g., "restaurants in Paris")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Our AI automatically <strong>searches the internet</strong> to find relevant companies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Intelligent scraping extracts <strong>emails and phone numbers</strong> from each website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Results appear in your dashboard, ready to <strong>export as CSV</strong></span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <SearchExamples />
      </div>
    </div>
  );
}
