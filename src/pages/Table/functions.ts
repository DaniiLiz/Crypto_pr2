import { CryptoDataType, ResponseDataType } from "./types.ts";
import axios from "axios";

export function transformData(data: ResponseDataType[]): CryptoDataType[] {
  return data.map((item, index) => ({
    key: item.id || index.toString(), // Используем id криптовалюты как ключ
    name: item.name,
    logo: item.image,
    symbol: item.symbol.toUpperCase(),
    price: `$${item.current_price ? item.current_price.toFixed(2) : 0}`,
    priceChange: `${item.price_change_percentage_24h ? item.price_change_percentage_24h.toFixed(2) : 0}%`,
    marketCap: `$${item.market_cap ? item.market_cap.toLocaleString() : 0}`,
    volume: `$${item.total_volume ? item.total_volume.toLocaleString() : 0}`,
    sparkline: item.sparkline_in_7d?.price || [], // Добавляем данные для графика
    priceChange7d: item.price_change_percentage_7d_in_currency,
  }));
}

export async function fetchData(page: number, sort: string) {
  const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${sort}&per_page=10&page=${page}&sparkline=true&price_change_percentage=7d`,
      {
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-KdWRZuVthavpyMiZnrNecJk1",
        },
      },
  );
  return data;
}