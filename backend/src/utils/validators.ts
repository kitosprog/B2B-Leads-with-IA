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
  const personalDomains = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'live.com',
    'icloud.com',
    'aol.com',
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return !personalDomains.includes(domain);
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
