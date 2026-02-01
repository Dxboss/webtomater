import { useState, useEffect } from 'react';

export type Currency = 'USD' | 'NGN' | 'GBP' | 'EUR';

export function useUserLocation() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [symbol, setSymbol] = useState('$');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add cache busting to ensure we get fresh data
    fetch(`/api/location?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.currency && data.country !== 'US') {
          // If API returns a specific country (not default US), use it
          setCurrency(data.currency as Currency);
          setSymbol(data.symbol);
        } else {
          // If API returns default 'US', check client-side timezone/locale to be sure
          // This helps when running locally or if Vercel headers are missing
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const locale = navigator.language;
          
          if (timeZone.includes('Lagos') || timeZone.includes('Africa') || locale.includes('NG')) {
            setCurrency('NGN');
            setSymbol('₦');
          } else if (timeZone.includes('London') || locale.includes('GB')) {
            setCurrency('GBP');
            setSymbol('£');
          } else if (timeZone.includes('Europe') || locale.includes('EU') || locale.includes('DE') || locale.includes('FR')) {
            setCurrency('EUR');
            setSymbol('€');
          } else if (data.currency) {
            // Fallback to API result if client checks don't match known overrides
            setCurrency(data.currency as Currency);
            setSymbol(data.symbol);
          }
        }
      })
      .catch(err => {
        console.error('Failed to fetch location:', err);
        // Fallback to navigator.language if API fails
        if (typeof navigator !== 'undefined') {
          const locale = navigator.language;
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

          if (locale.includes('NG') || timeZone.includes('Lagos')) {
            setCurrency('NGN');
            setSymbol('₦');
          } else if (locale.includes('GB') || timeZone.includes('London')) {
            setCurrency('GBP');
            setSymbol('£');
          } else if (locale.includes('EU') || locale.includes('DE') || locale.includes('FR') || timeZone.includes('Europe')) {
            setCurrency('EUR');
            setSymbol('€');
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { currency, symbol, loading };
}
