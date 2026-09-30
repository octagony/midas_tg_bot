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

export interface ITopCoin {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	market_cap: number;
	market_cap_rank: number;
	fully_diluted_valuation: number;
	total_volume: number;
	high_24h: number;
	low_24h: number;
	price_change_24h: number;
	price_change_percentage_24h: number;
	market_cap_change_24h: number;
	market_cap_change_percentage_24h: number;
	circulating_supply: number;
	total_supply: number;
	max_supply: number;
	ath: number;
	ath_change_percentage: number;
	ath_date: string;
	atl: number;
	atl_change_percentage: number;
	atl_date: string;
	roi: ITopCoinRoi;
	last_updated: string;
}

export interface ITopCoinRoi {
	times: number;
	currency: string;
	percentage: number;
}

export interface IPriceCoinRequest {
	coins: IPriceCoin[];
}

export interface IPriceCoin {
	id: string;
	name: string;
	api_symbol: string;
	symbol: string;
	market_cap_rank: number;
	thumb: string;
	large: string;
}

export interface ISpecificCoinRequest {
	id: string;
	symbol: string;
	name: string;
	price_change_24h: number;
	price_change_percentage_24h: number;
	market_data: {
		current_price: {
			usd: number;
		};
		high_24h: {
			usd: number;
		};
		low_24h: {
			usd: number;
		};
		market_cap: {
			usd: number;
		};
		total_volume: {
			usd: number;
		};
	};
	market_cap_rank: number;
}
