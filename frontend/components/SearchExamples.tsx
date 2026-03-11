'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export function SearchExamples() {
  const examples = [
    {
      category: 'By Industry',
      queries: [
        'software development companies in Berlin',
        'digital marketing agencies Barcelona',
        'renewable energy companies California',
        'biotechnology startups Boston',
      ],
    },
    {
      category: 'By Service',
      queries: [
        'web design freelancers Madrid',
        'legal consulting firms London',
        'accounting services New York',
        'HR recruitment agencies Paris',
      ],
    },
    {
      category: 'By Market',
      queries: [
        'b2b saas companies San Francisco',
        'e-commerce fashion brands Milan',
        'fintech startups Singapore',
        'food delivery services Amsterdam',
      ],
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="h-4 w-4 text-primary" />
            Search Examples
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examples.map((example, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground">
                  {example.category}
                </h4>
                <ul className="space-y-1.5">
                  {example.queries.map((query, qIdx) => (
                    <li key={qIdx} className="text-xs text-muted-foreground pl-3 border-l-2 border-muted">
                      "{query}"
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Pro tip:</strong> Be specific about industry, location, and company type for best results
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
