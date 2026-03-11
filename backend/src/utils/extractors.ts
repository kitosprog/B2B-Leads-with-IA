import { isValidEmail, isBusinessEmail, isValidPhone, normalizePhone } from './validators';

export function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex) || [];
  
  return [...new Set(matches)]
    .filter(email => isValidEmail(email) && isBusinessEmail(email))
    .slice(0, 5);
}

export function extractPhones(text: string): string[] {
  const phoneRegex = /[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}/g;
  const matches = text.match(phoneRegex) || [];
  
  return [...new Set(matches)]
    .map(normalizePhone)
    .filter(isValidPhone)
    .slice(0, 3);
}

export function extractCompanyName(html: string): string {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch) {
    let title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    title = title.split(/[-|–]/)[0].trim();
    return title || 'Unknown Company';
  }
  return 'Unknown Company';
}

export function findContactPages(html: string, baseUrl: string): string[] {
  const contactKeywords = ['contact', 'contacto', 'about', 'sobre', 'team', 'equipo'];
  const urlRegex = /href=["']([^"']+)["']/gi;
  const matches = [...html.matchAll(urlRegex)];
  
  const contactUrls = matches
    .map(match => match[1])
    .filter(url => {
      const urlLower = url.toLowerCase();
      return contactKeywords.some(keyword => urlLower.includes(keyword));
    })
    .slice(0, 3);

  return contactUrls.map(url => {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  });
}
