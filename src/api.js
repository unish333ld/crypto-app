import { cryptoData } from './data';

const supportedIds = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana', 'ripple', 'dogecoin', 'cardano', 'polkadot', 'chainlink'];

export const coins = cryptoData.result.filter((coin) => supportedIds.includes(coin.id));

export async function fetchCurrentPrices() {
  const ids = coins.map((coin) => coin.id).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`CoinGecko API: ${response.status}`);
  const data = await response.json();
  return Object.fromEntries(coins.map((coin) => [coin.id, { usd: data[coin.id]?.usd ?? coin.price, change: data[coin.id]?.usd_24h_change ?? 0, updatedAt: data[coin.id]?.last_updated_at ?? null }]));
}

export const fallbackPrices = Object.fromEntries(coins.map((coin) => [coin.id, { usd: coin.price, change: coin.priceChange1d, updatedAt: null }]));
