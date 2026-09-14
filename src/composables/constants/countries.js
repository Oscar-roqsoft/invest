// composables/constants/countries.js

export const COUNTRIES = [
    // ─── Popular ───────────────────────────────────────────
    { code: 'US', name: 'United States', flag: '🇺🇸', region: 'Popular' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Popular' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'Popular' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Popular' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Popular' },
    { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Popular' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Popular' },
    { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Popular' },
  
    // ─── Europe ────────────────────────────────────────────
    { code: 'AL', name: 'Albania', flag: '🇦🇱', region: 'Europe' },
    { code: 'AD', name: 'Andorra', flag: '🇦🇩', region: 'Europe' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe' },
    { code: 'BY', name: 'Belarus', flag: '🇧🇾', region: 'Europe' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'Europe' },
    { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', region: 'Europe' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', region: 'Europe' },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷', region: 'Europe' },
    { code: 'CY', name: 'Cyprus', flag: '🇨🇾', region: 'Europe' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'Europe' },
    { code: 'EE', name: 'Estonia', flag: '🇪🇪', region: 'Europe' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'Europe' },
    { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'Europe' },
    { code: 'HU', name: 'Hungary', flag: '🇭🇺', region: 'Europe' },
    { code: 'IS', name: 'Iceland', flag: '🇮🇸', region: 'Europe' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪', region: 'Europe' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
    { code: 'XK', name: 'Kosovo', flag: '🇽🇰', region: 'Europe' },
    { code: 'LV', name: 'Latvia', flag: '🇱🇻', region: 'Europe' },
    { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', region: 'Europe' },
    { code: 'LT', name: 'Lithuania', flag: '🇱🇹', region: 'Europe' },
    { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe' },
    { code: 'MT', name: 'Malta', flag: '🇲🇹', region: 'Europe' },
    { code: 'MD', name: 'Moldova', flag: '🇲🇩', region: 'Europe' },
    { code: 'MC', name: 'Monaco', flag: '🇲🇨', region: 'Europe' },
    { code: 'ME', name: 'Montenegro', flag: '🇲🇪', region: 'Europe' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
    { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', region: 'Europe' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'Europe' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'Europe' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴', region: 'Europe' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', region: 'Europe' },
    { code: 'SM', name: 'San Marino', flag: '🇸🇲', region: 'Europe' },
    { code: 'RS', name: 'Serbia', flag: '🇷🇸', region: 'Europe' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰', region: 'Europe' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮', region: 'Europe' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'Europe' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe' },
    { code: 'UA', name: 'Ukraine', flag: '🇺🇦', region: 'Europe' },
    { code: 'VA', name: 'Vatican City', flag: '🇻🇦', region: 'Europe' },
  
    // ─── Asia ──────────────────────────────────────────────
    { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia' },
    { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Asia' },
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'Asia' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'Asia' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'Asia' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Asia' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia' },
  
    // ─── Africa ────────────────────────────────────────────
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'Africa' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa' },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'Africa' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', region: 'Africa' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬', region: 'Africa' },
  
    // ─── Americas ──────────────────────────────────────────
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'Americas' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'Americas' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'Americas' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'Americas' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'Americas' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'Americas' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪', region: 'Americas' },
  
    // ─── Oceania ───────────────────────────────────────────
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania' },
  ];
  
  // Grouped by region for rendering
  export const COUNTRIES_BY_REGION = COUNTRIES.reduce((acc, country) => {
    if (!acc[country.region]) acc[country.region] = [];
    acc[country.region].push(country);
    return acc;
  }, {});
  
  // Helper to find a country by name
  export const findCountryByName = (name) =>
    COUNTRIES.find((c) => c.name === name) || null;
  
  // Region display order
  export const REGION_ORDER = ['Popular', 'Europe', 'Asia', 'Africa', 'Americas', 'Oceania'];
  
  // Region icons
  export const REGION_ICONS = {
    Popular: '🌍',
    Europe: '🇪🇺',
    Asia: '🌏',
    Africa: '🌍',
    Americas: '🌎',
    Oceania: '🌊',
  };