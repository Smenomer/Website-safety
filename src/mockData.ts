// Deterministic mock data generator for TrustLens URL Safety Checker

export interface TrafficPoint {
  month: string;
  visits: number;
}

export interface SecuritySignal {
  name: string;
  status: 'success' | 'warning' | 'destructive';
  label: string;
}

export interface AnalysisResult {
  domain: string;
  trustScore: number; // 0 - 100
  domainAge: string;
  registeredDate: string;
  registrant: string;
  registrar: string;
  countryCode: string;
  countryName: string;
  monthlyVisits: string;
  trafficTrend: TrafficPoint[];
  signals: SecuritySignal[];
}

// Predefined database of known domains
const knownDomains: Record<string, Omit<AnalysisResult, 'domain'>> = {
  'google.com': {
    trustScore: 99,
    domainAge: '28 yrs 9 mo',
    registeredDate: 'Registered Sep 1997',
    registrant: 'Google LLC',
    registrar: 'MarkMonitor Inc.',
    countryCode: 'US',
    countryName: 'United States',
    monthlyVisits: '~85.2B',
    trafficTrend: [
      { month: 'Jan', visits: 84.1 },
      { month: 'Feb', visits: 83.8 },
      { month: 'Mar', visits: 84.5 },
      { month: 'Apr', visits: 85.0 },
      { month: 'May', visits: 85.2 },
      { month: 'Jun', visits: 85.4 },
    ],
    signals: [
      { name: 'SSL / HTTPS', status: 'success', label: 'Valid SSL (SHA-256)' },
      { name: 'Blacklist Status', status: 'success', label: 'Clean (0/68 engines)' },
      { name: 'Malware Scan', status: 'success', label: 'No threats detected' },
      { name: 'Social Presence', status: 'success', label: 'Verified official profiles' },
    ]
  },
  'github.com': {
    trustScore: 98,
    domainAge: '18 yrs 5 mo',
    registeredDate: 'Registered Jan 2008',
    registrant: 'GitHub, Inc.',
    registrar: 'MarkMonitor Inc.',
    countryCode: 'US',
    countryName: 'United States',
    monthlyVisits: '~430M',
    trafficTrend: [
      { month: 'Jan', visits: 410 },
      { month: 'Feb', visits: 415 },
      { month: 'Mar', visits: 425 },
      { month: 'Apr', visits: 420 },
      { month: 'May', visits: 430 },
      { month: 'Jun', visits: 435 },
    ],
    signals: [
      { name: 'SSL / HTTPS', status: 'success', label: 'Valid SSL (DigiCert)' },
      { name: 'Blacklist Status', status: 'success', label: 'Clean (0/68 engines)' },
      { name: 'Malware Scan', status: 'success', label: 'No threats detected' },
      { name: 'Social Presence', status: 'success', label: 'Highly active social profiles' },
    ]
  },
  'paypal-security-alert.net': {
    trustScore: 8,
    domainAge: '4 days',
    registeredDate: 'Registered Jul 2026',
    registrant: 'Privacy Service Provided',
    registrar: 'Hostinger, UAB',
    countryCode: 'IS',
    countryName: 'Iceland',
    monthlyVisits: '< 100',
    trafficTrend: [
      { month: 'Jan', visits: 0 },
      { month: 'Feb', visits: 0 },
      { month: 'Mar', visits: 0 },
      { month: 'Apr', visits: 0 },
      { month: 'May', visits: 0.01 },
      { month: 'Jun', visits: 0.08 },
    ],
    signals: [
      { name: 'SSL / HTTPS', status: 'warning', label: 'Let\'s Encrypt (Recent)' },
      { name: 'Blacklist Status', status: 'destructive', label: 'Blacklisted (14/68 engines)' },
      { name: 'Malware Scan', status: 'destructive', label: 'Phishing scripts found' },
      { name: 'Social Presence', status: 'destructive', label: 'No presence detected' },
    ]
  },
  'free-crypto-tokens.org': {
    trustScore: 18,
    domainAge: '2 mo 12 days',
    registeredDate: 'Registered May 2026',
    registrant: 'REDACTED FOR PRIVACY',
    registrar: 'NameSilo, LLC',
    countryCode: 'PA',
    countryName: 'Panama',
    monthlyVisits: '~1.4K',
    trafficTrend: [
      { month: 'Jan', visits: 0 },
      { month: 'Feb', visits: 0 },
      { month: 'Mar', visits: 0.1 },
      { month: 'Apr', visits: 0.8 },
      { month: 'May', visits: 1.5 },
      { month: 'Jun', visits: 1.4 },
    ],
    signals: [
      { name: 'SSL / HTTPS', status: 'success', label: 'Valid SSL (Cloudflare)' },
      { name: 'Blacklist Status', status: 'warning', label: 'Suspicious (2/68 engines)' },
      { name: 'Malware Scan', status: 'warning', label: 'High-risk JS warnings' },
      { name: 'Social Presence', status: 'destructive', label: 'No presence detected' },
    ]
  },
  'wikipedia.org': {
    trustScore: 99,
    domainAge: '25 yrs 6 mo',
    registeredDate: 'Registered Jan 2001',
    registrant: 'Wikimedia Foundation, Inc.',
    registrar: 'MarkMonitor Inc.',
    countryCode: 'US',
    countryName: 'United States',
    monthlyVisits: '~4.8B',
    trafficTrend: [
      { month: 'Jan', visits: 4.6 },
      { month: 'Feb', visits: 4.5 },
      { month: 'Mar', visits: 4.7 },
      { month: 'Apr', visits: 4.8 },
      { month: 'May', visits: 4.8 },
      { month: 'Jun', visits: 4.9 },
    ],
    signals: [
      { name: 'SSL / HTTPS', status: 'success', label: 'Valid SSL (Let\'s Encrypt)' },
      { name: 'Blacklist Status', status: 'success', label: 'Clean (0/68 engines)' },
      { name: 'Malware Scan', status: 'success', label: 'No threats detected' },
      { name: 'Social Presence', status: 'success', label: 'Verified global pages' },
    ]
  }
};

// Helper to clean URL and extract clean domain name (e.g. https://www.google.com/search -> google.com)
export function cleanDomain(url: string): string {
  let hostname = url.trim();
  
  // Remove protocol
  if (hostname.includes('://')) {
    hostname = hostname.split('://')[1];
  }
  
  // Remove path, query params, etc.
  hostname = hostname.split('/')[0];
  
  // Remove query params if any
  hostname = hostname.split('?')[0];
  
  // Remove port
  hostname = hostname.split(':')[0];
  
  // Remove "www."
  if (hostname.startsWith('www.')) {
    hostname = hostname.substring(4);
  }
  
  return hostname.toLowerCase();
}

// Simple seedable PRNG based on string hash
function createPRNG(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return {
    next: () => {
      // Linear congruential generator parameters
      hash = (hash * 1664525 + 1013904223) % 4294967296;
      return Math.abs(hash) / 4294967296;
    }
  };
}

export function analyzeDomain(inputUrl: string): AnalysisResult {
  const domain = cleanDomain(inputUrl);
  
  if (!domain) {
    // Return a default bad domain response for empty query
    return {
      domain: 'invalid-input.net',
      trustScore: 0,
      domainAge: 'N/A',
      registeredDate: 'N/A',
      registrant: 'N/A',
      registrar: 'N/A',
      countryCode: 'UN',
      countryName: 'Unknown',
      monthlyVisits: '0',
      trafficTrend: [],
      signals: []
    };
  }

  // If in database, return predefined data
  if (knownDomains[domain]) {
    return {
      domain,
      ...knownDomains[domain]
    };
  }

  // Generate deterministic results using domain name as seed
  const prng = createPRNG(domain);
  
  // 1. Trust Score (0-100)
  // Biasing a bit towards 40-85 for random domains, but some very low/high
  const randomVal = prng.next();
  let trustScore = Math.floor(randomVal * 95) + 5; // 5 to 99
  
  // Certain extensions get lower scores deterministically
  if (domain.endsWith('.xyz') || domain.endsWith('.top') || domain.endsWith('.cc') || domain.endsWith('.tk') || domain.endsWith('.live')) {
    trustScore = Math.min(trustScore, 39); // Caps at destructive band
  } else if (domain.endsWith('.gov') || domain.endsWith('.edu')) {
    trustScore = Math.max(trustScore, 85); // Boosts to success band
  }

  // 2. Domain Age
  const ageYears = Math.floor(prng.next() * 15); // up to 15 years
  const ageMonths = Math.floor(prng.next() * 12);
  let domainAge = '';
  let registeredDate = '';
  
  if (trustScore < 25 && prng.next() > 0.4) {
    // Shady domains are usually very young
    const ageDays = Math.floor(prng.next() * 85) + 2;
    domainAge = `${ageDays} days`;
    registeredDate = `Registered ${ageDays} days ago`;
  } else {
    domainAge = ageYears === 0 ? `${ageMonths} mo` : `${ageYears} yrs ${ageMonths} mo`;
    const startYear = 2026 - ageYears;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startMonth = months[Math.floor(prng.next() * 12)];
    registeredDate = `Registered ${startMonth} ${startYear}`;
  }

  // 3. Ownership / WHOIS
  const registrars = [
    'GoDaddy.com, LLC',
    'Namecheap, Inc.',
    'Domain.com, LLC',
    'Google Domains',
    'Amazon Registrar, Inc.',
    'Cloudflare, Inc.',
    'Tucows Domains Inc.',
    'Network Solutions, LLC'
  ];
  const registrar = registrars[Math.floor(prng.next() * registrars.length)];
  
  const isPrivate = prng.next() > 0.45 || trustScore < 40;
  const companies = [
    'Global Tech Solutions Ltd',
    'Apex Software Group LLC',
    'E-Commerce Ventures Inc.',
    'Nova Digital Media',
    'Peak Interactive Corp',
    'Core Infrastructure Partners'
  ];
  const registrant = isPrivate ? 'Privacy Protected' : companies[Math.floor(prng.next() * companies.length)];
  
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'IS', name: 'Iceland' },
    { code: 'PA', name: 'Panama' },
    { code: 'IN', name: 'India' },
    { code: 'SG', name: 'Singapore' },
    { code: 'NL', name: 'Netherlands' }
  ];
  const countryIndex = Math.floor(prng.next() * countries.length);
  const country = countries[countryIndex];

  // 4. Traffic Estimate
  let trafficBase = prng.next();
  let monthlyVisits = '';
  let trendDivider = 1;
  
  if (trustScore > 85) {
    // High trust usually has higher traffic
    const visits = Math.floor(trafficBase * 10) + 1; // 1M - 11M
    monthlyVisits = `~${visits}M/mo`;
    trendDivider = 1;
  } else if (trustScore > 50) {
    const visits = Math.floor(trafficBase * 800) + 50; // 50K - 850K
    monthlyVisits = `~${visits}K/mo`;
    trendDivider = 1000;
  } else if (trustScore > 30) {
    const visits = Math.floor(trafficBase * 45) + 5; // 5K - 50K
    monthlyVisits = `~${visits}K/mo`;
    trendDivider = 1000;
  } else {
    // Low trust has very low traffic
    const visits = Math.floor(trafficBase * 900) + 50; // 50 - 950
    monthlyVisits = `~${visits}/mo`;
    trendDivider = 1000000;
  }

  // Generate 6-month historical trend line
  const trafficTrend: TrafficPoint[] = [];
  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  let currentTraffic = (trafficBase * 500 + 10) / trendDivider;
  
  for (let i = 0; i < 6; i++) {
    // Introduce random fluctuation based on deterministic prng
    const change = (prng.next() - 0.48) * 0.15 * currentTraffic;
    currentTraffic = Math.max(0.01, currentTraffic + change);
    trafficTrend.push({
      month: monthsList[i],
      visits: Number(currentTraffic.toFixed(2))
    });
  }

  // 5. Signals
  const sslStatus = trustScore > 35 ? 'success' : 'warning';
  const sslLabel = trustScore > 35 ? 'Valid SSL (Let\'s Encrypt)' : 'Self-Signed / Expiring SSL';
  
  const blacklistStatus = trustScore > 70 
    ? 'success' 
    : (trustScore > 40 ? 'warning' : 'destructive');
  const blacklistCount = trustScore > 70 
    ? 0 
    : (trustScore > 40 ? Math.floor(prng.next() * 2) + 1 : Math.floor(prng.next() * 12) + 5);
  const blacklistLabel = blacklistCount === 0 
    ? 'Clean (0/68 engines)' 
    : `Flagged (${blacklistCount}/68 engines)`;
    
  const malwareStatus = trustScore > 60 
    ? 'success' 
    : (trustScore > 30 ? 'warning' : 'destructive');
  const malwareLabel = malwareStatus === 'success' 
    ? 'No threats detected' 
    : (malwareStatus === 'warning' ? 'Suspicious obfuscated JS' : 'Malware payload detected');
    
  const socialStatus = trustScore > 75 
    ? 'success' 
    : (trustScore > 45 ? 'warning' : 'destructive');
  const socialLabel = socialStatus === 'success'
    ? 'Active social media profiles'
    : (socialStatus === 'warning' ? 'Limited social presence' : 'No matches on standard social hubs');

  const signals: SecuritySignal[] = [
    { name: 'SSL / HTTPS', status: sslStatus, label: sslLabel },
    { name: 'Blacklist Status', status: blacklistStatus, label: blacklistLabel },
    { name: 'Malware Scan', status: malwareStatus, label: malwareLabel },
    { name: 'Social Presence', status: socialStatus, label: socialLabel }
  ];

  return {
    domain,
    trustScore,
    domainAge,
    registeredDate,
    registrant,
    registrar,
    countryCode: country.code,
    countryName: country.name,
    monthlyVisits,
    trafficTrend,
    signals
  };
}
