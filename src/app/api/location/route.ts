import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Get country from Vercel header, default to 'US'
  const country = request.headers.get('x-vercel-ip-country') || 'US';
  
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

  return NextResponse.json({ country, currency, symbol });
}
