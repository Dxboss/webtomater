import { useState, useEffect } from 'react';

export type Currency = 'USD' | 'NGN' | 'GBP' | 'EUR';

export function useUserLocation() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [symbol, setSymbol] = useState('$');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/location')
      .then(res => res.json())
      .then(data => {
        if (data.currency) {
          setCurrency(data.currency as Currency);
          setSymbol(data.symbol);
        }
      })
      .catch(err => {
        console.error('Failed to fetch location:', err);
        // Fallback to navigator.language if API fails
        if (typeof navigator !== 'undefined') {
          const locale = navigator.language;
          if (locale.includes('NG')) {
            setCurrency('NGN');
            setSymbol('₦');
          } else if (locale.includes('GB')) {
            setCurrency('GBP');
            setSymbol('£');
          } else if (locale.includes('EU') || locale.includes('DE') || locale.includes('FR')) {
            setCurrency('EUR');
            setSymbol('€');
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { currency, symbol, loading };
}
