export interface CryptoCoin {
    id: string,
    symbol: string,
    name: string,
    image: string,
    current_price: number,
    market_cap: number,
    market_cap_rank: number,
    fully_diluted_valuation: number | null,
    total_volume: number,
    high_24h: number,
    low_24h: number,
    price_change_24h: number,
    price_change_percentage_24h: number,
    market_cap_change_24h: number,
    market_cap_change_percentage_24h: number,
    circulating_supply: number,
    total_supply: number | null,
    max_supply: number | null,
    ath: number,
    ath_change_percentage: number,
    ath_date: string,
    atl: number,
    atl_change_percentage: number,
    atl_date: string,
    roi: string | null,
    last_updated: string
};


export type SelectOptions =
    | "market_cap_asc"
    | "market_cap_desc"
    | "volume_asc"
    | "volume_desc"

export type MessageType = {
    text: string;
    username?: string;
    timestamp: string;
};

export type SystemMessageType = {
    text: string;
    timestamp: string;
};

export type ChatMessage = {
    type: 'message' | 'system';
    data: MessageType | SystemMessageType;
};