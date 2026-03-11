import { WebScraper } from '../scrapers/webScraper';

export interface GoogleMapsResult {
  name: string;
  website?: string;
  phone?: string;
  address?: string;
  rating?: number;
}

/**
 * GoogleMapsService - Extrae información de Google Maps/Business
 */
export class GoogleMapsService {
  private scraper: WebScraper;

  constructor() {
    this.scraper = new WebScraper();
  }

  async searchGoogleMaps(
    query: string,
    country?: string
  ): Promise<GoogleMapsResult[]> {
    console.log(`🗺️  Searching Google Maps for: "${query}"`);

    await this.scraper.init();

    try {
      const searchQuery = country ? `${query} ${country}` : query;
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

      const page = await this.scraper['browser']!.newPage();

      try {
        await page.goto(searchUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });

        // Esperar a que carguen los resultados
        await page.waitForTimeout(3000);

        // Extraer información de los resultados
        const results = await page.evaluate(() => {
          const businesses: any[] = [];

          // Selectores de Google Maps (pueden cambiar)
          const resultElements = document.querySelectorAll('[role="article"], .Nv2PK');

          resultElements.forEach((element, index) => {
            if (index >= 10) return; // Limitar a 10 resultados

            const nameEl = element.querySelector('[class*="fontHeadlineSmall"]');
            const phoneEl = element.querySelector('[data-tooltip*="phone"], [aria-label*="Phone"]');
            const websiteEl = element.querySelector('a[data-tooltip*="website"], a[aria-label*="Website"]');
            const addressEl = element.querySelector('[class*="W4Efsd"]');
            const ratingEl = element.querySelector('[role="img"][aria-label*="star"]');

            const name = nameEl?.textContent?.trim();
            const phone = phoneEl?.textContent?.trim() || phoneEl?.getAttribute('aria-label');
            const website = websiteEl?.getAttribute('href');
            const address = addressEl?.textContent?.trim();
            const ratingText = ratingEl?.getAttribute('aria-label');
            const rating = ratingText ? parseFloat(ratingText.match(/[\d.]+/)?.[0] || '0') : undefined;

            if (name) {
              businesses.push({
                name,
                phone,
                website,
                address,
                rating,
              });
            }
          });

          return businesses;
        });

        await page.close();

        console.log(`  ✓ Found ${results.length} businesses on Google Maps`);
        return results;

      } catch (error) {
        console.error(`  ✗ Error scraping Google Maps:`, error);
        await page.close();
        return [];
      }

    } finally {
      await this.scraper.close();
    }
  }

  /**
   * Buscar información específica de una empresa en Google Maps
   */
  async getBusinessDetails(
    businessName: string,
    location?: string
  ): Promise<GoogleMapsResult | null> {
    const query = location ? `${businessName} ${location}` : businessName;
    const results = await this.searchGoogleMaps(query);

    // Retornar el primer resultado (el más relevante)
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Extraer teléfono y website de Google Business Profile
   */
  async enrichCompanyData(
    companyName: string,
    country?: string
  ): Promise<{ phone?: string; website?: string }> {
    console.log(`  → Enriching "${companyName}" with Google Maps data`);

    const details = await this.getBusinessDetails(companyName, country);

    if (details) {
      console.log(`    ✓ Found on Google Maps: phone=${!!details.phone}, website=${!!details.website}`);
      return {
        phone: details.phone,
        website: details.website,
      };
    }

    return {};
  }
}
