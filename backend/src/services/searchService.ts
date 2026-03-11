import { WebScraper } from '../scrapers/webScraper';

export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

export class SearchService {
  private scraper: WebScraper;

  constructor() {
    this.scraper = new WebScraper();
  }

  async searchCompanies(query: string, country?: string): Promise<SearchResult[]> {
    await this.scraper.init();

    console.log(`🔍 Starting deep search for: "${query}"`);

    // Construir múltiples variaciones de consulta
    const queries = this.buildSearchQueries(query, country);
    
    const allResults: SearchResult[] = [];

    // Buscar en múltiples motores y con múltiples consultas
    for (const searchQuery of queries) {
      try {
        console.log(`  → Searching: "${searchQuery}"`);
        const results = await this.performSearch(searchQuery);
        allResults.push(...results);
      } catch (error) {
        console.error(`  ✗ Search failed for: "${searchQuery}"`);
      }
    }

    // Eliminar duplicados por URL
    const uniqueResults = this.deduplicateResults(allResults);
    
    console.log(`✅ Found ${uniqueResults.length} unique companies`);
    
    await this.scraper.close();
    
    return uniqueResults;
  }

  private buildSearchQueries(query: string, country?: string): string[] {
    const queries: string[] = [];
    const location = country ? ` in ${country}` : '';

    // Query principal con keywords de contacto
    queries.push(`${query}${location} contact email phone`);
    
    // Query para directorios empresariales
    queries.push(`${query}${location} business directory`);
    
    // Query para páginas de contacto específicas
    queries.push(`${query}${location} "contact us" "email"`);
    
    // Query para LinkedIn
    queries.push(`${query}${location} site:linkedin.com/company`);
    
    // Query para encontrar sitios web oficiales
    queries.push(`${query}${location} official website`);

    return queries;
  }

  private buildEnhancedQuery(query: string, country?: string): string {
    let enhanced = query;

    // Si no menciona "empresa" o "company", agregarlo
    if (!query.toLowerCase().includes('empresa') && 
        !query.toLowerCase().includes('company') &&
        !query.toLowerCase().includes('negocio')) {
      enhanced += ' empresas';
    }

    // Agregar país si está especificado
    if (country) {
      enhanced += ` en ${country}`;
    }

    // Agregar términos para encontrar páginas de contacto
    enhanced += ' sitio web contacto';

    return enhanced;
  }

  private async performSearch(query: string): Promise<SearchResult[]> {
    // BÚSQUEDA EN PARALELO en múltiples motores
    const searchPromises = [
      this.searchGoogle(query).catch((err) => {
        console.log('  ✗ Google failed');
        return [];
      }),
      this.searchBing(query).catch((err) => {
        console.log('  ✗ Bing failed');
        return [];
      }),
      this.searchDuckDuckGo(query).catch((err) => {
        console.log('  ✗ DuckDuckGo failed');
        return [];
      }),
    ];

    const allResults = await Promise.all(searchPromises);
    
    // Combinar todos los resultados
    const combined: SearchResult[] = [];
    for (const engineResults of allResults) {
      combined.push(...engineResults);
    }

    return this.filterRelevantResults(combined);
  }

  private async searchGoogle(query: string): Promise<SearchResult[]> {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=20`;
    const page = await this.scraper['browser']!.newPage();

    try {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(searchUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });

      await page.waitForTimeout(2000);

      const results = await page.evaluate(() => {
        const searchResults: Array<{ url: string; title: string; snippet: string }> = [];
        
        // Selectores de Google para resultados orgánicos
        const resultElements = document.querySelectorAll('div.g');

        resultElements.forEach(element => {
          const link = element.querySelector('a[href]');
          const titleElement = element.querySelector('h3');
          const snippetElement = element.querySelector('.VwiC3b, .yXK7lf');

          if (link && titleElement) {
            const href = link.getAttribute('href');
            const title = titleElement.textContent || '';
            const snippet = snippetElement?.textContent || '';

            if (href && href.startsWith('http')) {
              const excludeDomains = [
                'google.com', 'youtube.com', 'facebook.com', 'twitter.com',
                'instagram.com', 'wikipedia.org', 'yelp.com', 'tripadvisor'
              ];

              const isExcluded = excludeDomains.some(domain => href.includes(domain));

              if (!isExcluded && title && title.length > 0) {
                try {
                  const url = new URL(href);
                  searchResults.push({
                    url: url.origin,
                    title: title,
                    snippet: snippet
                  });
                } catch (e) {
                  // Ignorar URLs inválidas
                }
              }
            }
          }
        });

        return searchResults;
      });

      await page.close();

      // Eliminar duplicados por URL
      const uniqueResults = results.reduce((acc, current) => {
        const exists = acc.find(item => item.url === current.url);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, [] as SearchResult[]);

      return uniqueResults.slice(0, 15);

    } catch (error) {
      await page.close();
      throw error;
    }
  }

  private async searchBing(query: string): Promise<SearchResult[]> {
    const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=20`;
    const page = await this.scraper['browser']!.newPage();

    try {
      await page.goto(searchUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      await page.waitForTimeout(2000);

      const results = await page.evaluate(() => {
        const searchResults: Array<{ url: string; title: string; snippet: string }> = [];
        const resultElements = document.querySelectorAll('li.b_algo');

        resultElements.forEach(element => {
          const titleEl = element.querySelector('h2 a');
          const snippetEl = element.querySelector('.b_caption p');

          if (titleEl) {
            const href = titleEl.getAttribute('href');
            const title = titleEl.textContent?.trim() || '';
            const snippet = snippetEl?.textContent?.trim() || '';

            if (href && href.startsWith('http')) {
              try {
                const url = new URL(href);
                searchResults.push({
                  url: url.origin,
                  title,
                  snippet,
                });
              } catch (e) {
                // Ignorar URLs inválidas
              }
            }
          }
        });

        return searchResults;
      });

      await page.close();
      return results.slice(0, 15);
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  private async searchDuckDuckGo(query: string): Promise<SearchResult[]> {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const page = await this.scraper['browser']!.newPage();

    try {
      await page.goto(searchUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });

      const results = await page.evaluate(() => {
        const searchResults: Array<{ url: string; title: string; snippet: string }> = [];
        
        const resultElements = document.querySelectorAll('.result');

        resultElements.forEach(element => {
          const titleElement = element.querySelector('.result__a');
          const urlElement = element.querySelector('.result__url');
          const snippetElement = element.querySelector('.result__snippet');

          if (titleElement && urlElement) {
            const title = titleElement.textContent?.trim() || '';
            const urlText = urlElement.textContent?.trim().replace(/\s+/g, '') || '';
            const snippet = snippetElement?.textContent?.trim() || '';

            if (urlText && title) {
              try {
                const url = urlText.startsWith('http') ? urlText : `https://${urlText}`;
                searchResults.push({ url, title, snippet });
              } catch (e) {
                // Ignorar URLs inválidas
              }
            }
          }
        });

        return searchResults;
      });

      await page.close();
      return results.slice(0, 15);

    } catch (error) {
      await page.close();
      throw error;
    }
  }

  async extractUrls(results: SearchResult[]): Promise<string[]> {
    return results.map(r => r.url);
  }

  private deduplicateResults(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    const unique: SearchResult[] = [];

    for (const result of results) {
      // Normalizar URL para comparación
      const normalizedUrl = result.url.toLowerCase().replace(/\/$/, '');
      
      if (!seen.has(normalizedUrl)) {
        seen.add(normalizedUrl);
        unique.push(result);
      }
    }

    return unique;
  }

  private filterRelevantResults(results: SearchResult[]): SearchResult[] {
    const excludeDomains = [
      'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'x.com',
      'instagram.com', 'wikipedia.org', 'yelp.com', 'tripadvisor',
      'amazon.com', 'ebay.com', 'pinterest.com', 'reddit.com',
    ];

    return results.filter(result => {
      const url = result.url.toLowerCase();
      
      // Excluir dominios irrelevantes
      const isExcluded = excludeDomains.some(domain => url.includes(domain));
      if (isExcluded) return false;

      // Debe tener título
      if (!result.title || result.title.length < 3) return false;

      // Debe ser una URL válida
      try {
        new URL(result.url);
        return true;
      } catch {
        return false;
      }
    });
  }
}
