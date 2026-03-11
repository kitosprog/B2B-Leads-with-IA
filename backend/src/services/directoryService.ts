import { WebScraper } from '../scrapers/webScraper';
import { SearchResult } from './searchService';

/**
 * DirectoryService - Búsqueda en directorios empresariales especializados
 */
export class DirectoryService {
  private scraper: WebScraper;

  // Directorios empresariales por país
  private directories: { [country: string]: string[] } = {
    spain: [
      'https://www.infobel.com/es/spain/',
      'https://empresite.eleconomista.es/',
      'https://www.paginasamarillas.es/',
      'https://axesor.es/',
    ],
    usa: [
      'https://www.yellowpages.com/',
      'https://www.manta.com/',
      'https://www.dnb.com/',
      'https://www.bbb.org/',
    ],
    uk: [
      'https://www.yell.com/',
      'https://www.companieshouse.gov.uk/',
      'https://www.192.com/',
    ],
    global: [
      'https://www.europages.com/',
      'https://www.kompass.com/',
      'https://www.thomasnet.com/',
    ],
  };

  constructor() {
    this.scraper = new WebScraper();
  }

  async searchInDirectories(
    companyName: string,
    country?: string
  ): Promise<SearchResult[]> {
    console.log(`📚 Searching in business directories for: "${companyName}"`);
    
    const results: SearchResult[] = [];
    const countryLower = country?.toLowerCase() || 'global';
    
    // Obtener directorios relevantes
    const relevantDirectories = [
      ...(this.directories[countryLower] || []),
      ...this.directories.global,
    ];

    await this.scraper.init();

    for (const directory of relevantDirectories.slice(0, 5)) {
      try {
        const directoryResults = await this.searchDirectory(
          directory,
          companyName
        );
        results.push(...directoryResults);
      } catch (error) {
        console.error(`  ✗ Error searching ${directory}:`, error);
      }
    }

    await this.scraper.close();

    console.log(`  ✓ Found ${results.length} results from directories`);
    return results;
  }

  private async searchDirectory(
    directoryUrl: string,
    companyName: string
  ): Promise<SearchResult[]> {
    // Esta es una implementación simplificada
    // En producción, cada directorio necesitaría su propio scraper específico
    
    console.log(`  → Searching in: ${new URL(directoryUrl).hostname}`);
    
    // Por ahora, retornamos resultados vacíos
    // En una implementación completa, scrapearíamos cada directorio
    return [];
  }

  async searchLinkedIn(companyName: string): Promise<SearchResult[]> {
    console.log(`💼 Searching LinkedIn for: "${companyName}"`);
    
    const results: SearchResult[] = [];

    await this.scraper.init();

    try {
      // Buscar página de empresa en LinkedIn
      const searchUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(companyName)}`;
      
      // Nota: LinkedIn requiere autenticación, esta es una implementación básica
      // En producción, necesitarías usar la API de LinkedIn o un servicio de scraping especializado
      
      console.log(`  → Searching: ${searchUrl}`);
      
      // Por ahora, retornamos vacío (requiere autenticación)
      
    } catch (error) {
      console.error(`  ✗ Error searching LinkedIn:`, error);
    } finally {
      await this.scraper.close();
    }

    return results;
  }

  /**
   * Buscar en Google Maps / Google Business
   */
  async searchGoogleBusiness(
    companyName: string,
    country?: string
  ): Promise<SearchResult[]> {
    console.log(`🗺️  Searching Google Business for: "${companyName}"`);
    
    const results: SearchResult[] = [];
    await this.scraper.init();

    try {
      const location = country || '';
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(companyName + ' ' + location)}&tbm=lcl`;
      
      console.log(`  → Searching Google Business`);
      
      // Implementación básica - en producción necesitarías scraping más sofisticado
      
    } catch (error) {
      console.error(`  ✗ Error searching Google Business:`, error);
    } finally {
      await this.scraper.close();
    }

    return results;
  }
}
