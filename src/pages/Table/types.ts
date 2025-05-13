export interface CryptoDataType {
  key: string;
  name: string;
  symbol: string;
  price: string;
  priceChange: string;
  priceChange7d?: number;
  marketCap: string;
  volume: string;
  logo: string;
  sparkline?: number[];
}

export interface ResponseDataType {
  id: string;
  market_cap_rank: number;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  image: string;
  total_volume: number;
  sparkline_in_7d?: {
    price: number[];
  };
}