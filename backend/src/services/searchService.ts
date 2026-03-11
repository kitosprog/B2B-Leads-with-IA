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

    // Construir consulta mejorada
    const enhancedQuery = this.buildEnhancedQuery(query, country);
    
    // Intentar múltiples motores de búsqueda
    const results = await this.performSearch(enhancedQuery);
    
    await this.scraper.close();
    
    return results;
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
    try {
      // Intentar primero con Google
      const googleResults = await this.searchGoogle(query);
      if (googleResults.length > 0) {
        return googleResults;
      }
    } catch (error) {
      console.log('Google search failed, trying DuckDuckGo...');
    }

    try {
      // Fallback a DuckDuckGo
      return await this.searchDuckDuckGo(query);
    } catch (error) {
      console.error('All search methods failed:', error);
      return [];
    }
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
}
