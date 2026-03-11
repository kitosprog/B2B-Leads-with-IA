import { chromium, Browser, Page } from 'playwright';
import { config } from '../config';
import { extractEmails, extractPhones, extractCompanyName, findContactPages } from '../utils/extractors';
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

      await page.goto(normalizedUrl, {
        waitUntil: 'domcontentloaded',
        timeout: config.scraping.timeout,
      });

      const html = await page.content();
      const text = await page.evaluate(() => document.body.innerText);

      let emails = extractEmails(text);
      let phones = extractPhones(text);

      if (emails.length === 0 || phones.length === 0) {
        const contactPages = findContactPages(html, normalizedUrl);
        
        for (const contactUrl of contactPages) {
          try {
            await page.goto(contactUrl, { 
              waitUntil: 'domcontentloaded',
              timeout: 10000 
            });
            const contactText = await page.evaluate(() => document.body.innerText);
            
            if (emails.length === 0) {
              emails = extractEmails(contactText);
            }
            if (phones.length === 0) {
              phones = extractPhones(contactText);
            }
            
            if (emails.length > 0 && phones.length > 0) {
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      const linkedinLink = await page.evaluate(() => {
        const link = Array.from(document.querySelectorAll('a'))
          .find(a => a.href.includes('linkedin.com'));
        return link?.href || null;
      });

      const companyName = extractCompanyName(html);

      return {
        name: companyName,
        website: normalizedUrl,
        email: emails[0] || null,
        phone: phones[0] || null,
        contact_page: null,
        linkedin: linkedinLink,
      };

    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
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
