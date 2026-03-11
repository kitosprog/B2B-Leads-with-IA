import { chromium, Browser, Page } from 'playwright';
import { config } from '../config';
import { extractEmails, extractPhones, extractCompanyName, findContactPages, extractFromHTML } from '../utils/extractors';
import { normalizeUrl } from '../utils/validators';

export interface ScrapedData {
  name: string;
  website: string;
  email: string | null;
  phone: string | null;
  contact_page: string | null;
  linkedin: string | null;
}

export class WebScraper {
  private browser: Browser | null = null;

  async init() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeWebsite(url: string): Promise<ScrapedData | null> {
    if (!this.browser) {
      await this.init();
    }

    const normalizedUrl = normalizeUrl(url);
    let page: Page | null = null;

    try {
      page = await this.browser!.newPage();
      await page.setUserAgent(config.scraping.userAgent);

      console.log(`    🔍 Deep scraping: ${normalizedUrl}`);

      await page.goto(normalizedUrl, {
        waitUntil: 'domcontentloaded',
        timeout: config.scraping.timeout,
      });

      const html = await page.content();
      const text = await page.evaluate(() => document.body.innerText);

      // Extraer de texto y HTML
      let emails = extractEmails(text);
      let phones = extractPhones(text);
      
      // También buscar en el HTML (mailto:, tel:, data-attributes, comentarios)
      const htmlData = extractFromHTML(html);
      emails = [...new Set([...emails, ...htmlData.emails])];
      phones = [...new Set([...phones, ...htmlData.phones])];
      
      let contactPageUrl: string | null = null;

      // BÚSQUEDA PROFUNDA: Explorar múltiples páginas
      const pagesToExplore = [
        { path: '/contact', name: 'Contact' },
        { path: '/contacto', name: 'Contacto' },
        { path: '/contact-us', name: 'Contact Us' },
        { path: '/about', name: 'About' },
        { path: '/about-us', name: 'About Us' },
        { path: '/team', name: 'Team' },
        { path: '/equipo', name: 'Equipo' },
        { path: '/empresa', name: 'Empresa' },
        { path: '/nosotros', name: 'Nosotros' },
      ];

      // Primero, buscar links en la página actual
      const discoveredPages = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const contactKeywords = ['contact', 'contacto', 'about', 'sobre', 'team', 'equipo', 'nosotros'];
        
        return links
          .map(a => a.getAttribute('href'))
          .filter(href => href && contactKeywords.some(kw => href.toLowerCase().includes(kw)))
          .slice(0, 5);
      });

      // Combinar páginas descubiertas con rutas comunes
      const allPagesToTry = [
        ...discoveredPages.map(p => p),
        ...pagesToExplore.map(p => p.path),
      ];

      // Explorar cada página para encontrar más contactos
      for (const pagePath of allPagesToTry.slice(0, 8)) {
        // Limitar a 8 páginas por sitio
        try {
          const fullUrl = new URL(pagePath, normalizedUrl).href;
          
          // Evitar duplicados
          if (fullUrl === normalizedUrl) continue;

          console.log(`      → Exploring: ${fullUrl}`);
          
          await page.goto(fullUrl, { 
            waitUntil: 'domcontentloaded',
            timeout: 15000 
          });

          const pageText = await page.evaluate(() => document.body.innerText);
          
          // Extraer más emails y teléfonos
          const newEmails = extractEmails(pageText);
          const newPhones = extractPhones(pageText);
          
          if (newEmails.length > 0) {
            emails = [...new Set([...emails, ...newEmails])];
            console.log(`        ✓ Found ${newEmails.length} more emails`);
          }
          
          if (newPhones.length > 0) {
            phones = [...new Set([...phones, ...newPhones])];
            console.log(`        ✓ Found ${newPhones.length} more phones`);
          }

          // Guardar la página de contacto si encontramos datos aquí
          if (!contactPageUrl && (newEmails.length > 0 || newPhones.length > 0)) {
            contactPageUrl = fullUrl;
          }

          // Si ya tenemos buenos datos, podemos parar
          if (emails.length >= 3 && phones.length >= 2) {
            break;
          }

        } catch (error) {
          // Continuar con la siguiente página
          continue;
        }
      }

      // Buscar LinkedIn y otras redes sociales
      await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded' });
      
      const socialLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        
        return {
          linkedin: links.find(a => a.href.includes('linkedin.com/company'))?.href || null,
          facebook: links.find(a => a.href.includes('facebook.com'))?.href || null,
          twitter: links.find(a => a.href.includes('twitter.com') || a.href.includes('x.com'))?.href || null,
        };
      });

      const companyName = extractCompanyName(html);

      const result = {
        name: companyName,
        website: normalizedUrl,
        email: emails[0] || null,
        phone: phones[0] || null,
        contact_page: contactPageUrl,
        linkedin: socialLinks.linkedin,
      };

      console.log(`    ✅ Extracted: ${emails.length} emails, ${phones.length} phones`);

      return result;

    } catch (error) {
      console.error(`    ✗ Error scraping ${url}:`, error);
      return null;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async scrapeMultiple(urls: string[]): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];

    for (const url of urls) {
      const data = await this.scrapeWebsite(url);
      if (data) {
        results.push(data);
      }
      await this.delay(1000 + Math.random() * 2000);
    }

    return results;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
