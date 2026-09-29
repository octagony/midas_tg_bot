export interface IGlobalStatsRequest {
	data: {
		active_cryptocurrencies: number;
		upcoming_icos: number;
		ongoing_icos: number;
		ended_icos: number;
		markets: number;
		total_market_cap: ITotalMarketCap;
		total_volume: ITotalVolume;
		market_cap_percentage: IMarketCapPercentage;
		market_cap_change_percentage_24h_usd: number;
		volume_change_percentage_24h_usd: number;
		updated_at: number;
	};
}

export interface ITotalMarketCap {
	[key: string]: number;
}

export interface ITotalVolume {
	[key: string]: number;
}

export interface IMarketCapPercentage {
	[key: string]: number;
}

export interface ITrendingSearchRequest {
	coins: ICoinInfo[];
}

export interface ICoinInfo {
	item: IItemCoin;
}

export interface IItemCoin {
	id: string;
	coin_id: number;
	name: string;
	symbol: string;
	market_cap_rank: number;
	thumb: string;
	small: string;
	large: string;
	slug: string;
	price_btc: number;
	score: number;
	data: IDataCoin;
}

export interface IDataCoin {
	price: number;
	price_btc: string;
	price_change_percentage_24h: PriceChangePercentage24h;
	market_cap: string;
	market_cap_btc: string;
	total_volume: string;
	total_volume_btc: string;
	sparkline: string;
	content: IContentCoin;
}

export interface PriceChangePercentage24h {
	[key: string]: number;
}

export interface IContentCoin {
	title: string;
	description: string;
}
