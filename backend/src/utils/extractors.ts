import { isValidEmail, isBusinessEmail, isValidPhone, normalizePhone } from './validators';

export function extractEmails(text: string): string[] {
  const emailPatterns = [
    // Patrón estándar
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    // Emails obfuscados (usuario [at] dominio [dot] com)
    /[a-zA-Z0-9._%+-]+\s*\[at\]\s*[a-zA-Z0-9.-]+\s*\[dot\]\s*[a-zA-Z]{2,}/gi,
    // Emails con espacios (usuario @ dominio . com)
    /[a-zA-Z0-9._%+-]+\s*@\s*[a-zA-Z0-9.-]+\s*\.\s*[a-zA-Z]{2,}/g,
  ];

  const allMatches: string[] = [];

  for (const pattern of emailPatterns) {
    const matches = text.match(pattern) || [];
    allMatches.push(...matches);
  }

  // Limpiar y normalizar emails ofuscados
  const cleanedEmails = allMatches.map(email => {
    return email
      .replace(/\s*\[at\]\s*/gi, '@')
      .replace(/\s*\[dot\]\s*/gi, '.')
      .replace(/\s+/g, '')
      .toLowerCase();
  });

  // Filtrar y retornar únicos
  const validEmails = [...new Set(cleanedEmails)]
    .filter(email => isValidEmail(email) && isBusinessEmail(email))
    .slice(0, 10);
  
  console.log(`      [DEBUG] Found ${validEmails.length} valid emails from ${allMatches.length} matches`);
  
  return validEmails;
}

export function extractPhones(text: string): string[] {
  const phonePatterns = [
    // Formato internacional (+34 912 345 678)
    /\+\d{1,3}[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g,
    // Formato con paréntesis (+34) 912 345 678, (912) 345 678
    /\(?\+?\d{1,3}\)?[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}/g,
    // Formato simple (912345678, 912 345 678)
    /\b\d{3}[\s.-]?\d{3}[\s.-]?\d{3,4}\b/g,
    // Solo números consecutivos (mínimo 9)
    /\b\d{9,15}\b/g,
    // Tel: o Phone: seguido de número
    /(?:tel|phone|teléfono|móvil|telf|fono|celular|tlf)[\s:]*([+\d(][\d\s.()-]{8,})/gi,
    // Formato con espacios: 91 234 56 78
    /\b\d{2,3}\s+\d{3}\s+\d{2,3}\s+\d{2,3}\b/g,
  ];

  const allMatches: string[] = [];

  for (const pattern of phonePatterns) {
    const matches = text.match(pattern) || [];
    allMatches.push(...matches);
  }

  // Normalizar y validar
  const normalized = allMatches
    .map(phone => {
      // Limpiar prefijos como "Tel:", "Phone:"
      phone = phone.replace(/^(tel|phone|teléfono|móvil|telf|fono|celular|tlf)[\s:]*/gi, '');
      return normalizePhone(phone);
    })
    .filter(phone => isValidPhone(phone));

  console.log(`      [DEBUG] Found ${normalized.length} valid phones from ${allMatches.length} matches`);

  return [...new Set(normalized)].slice(0, 10); // Aumentado a 10 teléfonos
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
  const contactKeywords = [
    'contact', 'contacto', 'contact-us', 'contactenos',
    'about', 'sobre', 'about-us', 'quienes-somos',
    'team', 'equipo', 'our-team', 'nuestro-equipo',
    'nosotros', 'empresa', 'company', 'get-in-touch',
    'reach-us', 'connect', 'support', 'soporte',
    'help', 'ayuda', 'offices', 'oficinas'
  ];
  
  const urlRegex = /href=["']([^"']+)["']/gi;
  const matches = [...html.matchAll(urlRegex)];
  
  const contactUrls = matches
    .map(match => match[1])
    .filter(url => {
      const urlLower = url.toLowerCase();
      return contactKeywords.some(keyword => urlLower.includes(keyword));
    })
    .slice(0, 8); // Aumentado a 8 páginas

  return contactUrls.map(url => {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  });
}

export function extractFromHTML(html: string): { emails: string[], phones: string[] } {
  // También buscar en atributos HTML y comentarios
  const emails: string[] = [];
  const phones: string[] = [];

  // Buscar en atributos href="mailto:"
  const mailtoRegex = /mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  const mailtoMatches = [...html.matchAll(mailtoRegex)];
  emails.push(...mailtoMatches.map(m => m[1]));

  // Buscar en atributos href="tel:"
  const telRegex = /tel:([+\d][\d\s.()-]+)/gi;
  const telMatches = [...html.matchAll(telRegex)];
  phones.push(...telMatches.map(m => m[1]));

  // Buscar en data-attributes
  const dataEmailRegex = /data-email=["']([^"']+)["']/gi;
  const dataEmailMatches = [...html.matchAll(dataEmailRegex)];
  emails.push(...dataEmailMatches.map(m => m[1]));

  // Buscar en data-phone, data-tel
  const dataPhoneRegex = /data-(?:phone|tel|telefono)=["']([^"']+)["']/gi;
  const dataPhoneMatches = [...html.matchAll(dataPhoneRegex)];
  phones.push(...dataPhoneMatches.map(m => m[1]));

  // Buscar en JSON-LD (schema.org)
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const jsonLdMatches = [...html.matchAll(jsonLdRegex)];
  
  for (const match of jsonLdMatches) {
    try {
      const jsonData = JSON.parse(match[1]);
      
      // Buscar email en JSON-LD
      if (jsonData.email) emails.push(jsonData.email);
      if (jsonData.contactPoint?.email) emails.push(jsonData.contactPoint.email);
      
      // Buscar teléfono en JSON-LD
      if (jsonData.telephone) phones.push(jsonData.telephone);
      if (jsonData.contactPoint?.telephone) phones.push(jsonData.contactPoint.telephone);
      if (jsonData.phone) phones.push(jsonData.phone);
    } catch (e) {
      // Ignorar JSON inválido
    }
  }

  // Buscar en comentarios HTML
  const commentRegex = /<!--[\s\S]*?-->/g;
  const comments = html.match(commentRegex) || [];
  
  for (const comment of comments) {
    const commentEmails = extractEmails(comment);
    const commentPhones = extractPhones(comment);
    emails.push(...commentEmails);
    phones.push(...commentPhones);
  }

  // Buscar en meta tags
  const metaEmailRegex = /<meta[^>]*(?:name|property)=["'](?:email|contact)["'][^>]*content=["']([^"']+)["']/gi;
  const metaEmailMatches = [...html.matchAll(metaEmailRegex)];
  emails.push(...metaEmailMatches.map(m => m[1]));

  console.log(`      [DEBUG HTML] mailto: ${mailtoMatches.length}, tel: ${telMatches.length}, JSON-LD: ${jsonLdMatches.length}`);

  return {
    emails: [...new Set(emails)].filter(e => isValidEmail(e) && isBusinessEmail(e)),
    phones: [...new Set(phones)].map(normalizePhone).filter(isValidPhone)
  };
}
