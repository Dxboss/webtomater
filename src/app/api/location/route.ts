import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Get country from Vercel header
  let country = request.headers.get('x-vercel-ip-country');
  let source = 'vercel';
  
  // If no Vercel header (local dev), try external service
  if (!country) {
    try {
      const ipRes = await fetch('http://ip-api.com/json/?fields=countryCode', { 
        next: { revalidate: 3600 } // Cache for 1 hour to avoid rate limits
      });
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        country = ipData.countryCode;
        source = 'external';
      }
    } catch (e) {
      console.error('External IP lookup failed:', e);
    }
  }

  // Fallback to US if all else fails
  if (!country) {
    country = 'US';
    source = 'default';
  }
  
  let currency = 'USD';
  let symbol = '$';
  
  // Map country to currency
  if (country === 'NG') {
    currency = 'NGN';
    symbol = '₦';
  } else if (country === 'GB') {
    currency = 'GBP';
    symbol = '£';
  } else if (['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'].includes(country)) {
    currency = 'EUR';
    symbol = '€';
  }

  return NextResponse.json({ country, currency, symbol, source });
}
