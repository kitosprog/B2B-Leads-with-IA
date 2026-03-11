export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return normalized.length >= 8 && normalized.length <= 20;
}

export function isBusinessEmail(email: string): boolean {
  // Lista de dominios personales comunes, pero NO bloqueamos todos
  // Muchas pequeñas empresas usan Gmail/Outlook para sus negocios
  const spamDomains = [
    'example.com',
    'test.com',
    'localhost',
    'tempmail.com',
    '10minutemail.com',
  ];
  
  if (!email.includes('@')) return false;
  
  const domain = email.split('@')[1]?.toLowerCase();
  
  // Bloquear solo dominios de spam/test
  if (spamDomains.includes(domain)) return false;
  
  // Aceptar TODO lo demás (incluyendo Gmail, Outlook, etc.)
  // Muchos negocios legítimos usan estos servicios
  return true;
}

export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.origin;
  } catch {
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  }
}
