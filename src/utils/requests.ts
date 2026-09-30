import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import {
	COINGECKO_API_URL,
	GLOBAL_STATS_COMMAND,
	TOP_10_SEARCH_REQUEST_URL,
	TRENDING_SEARCH_REQUEST_URL,
} from "./constants.js";
import type {
	IGlobalStatsRequest,
	ITopCoin,
	ITrendingSearchRequest,
} from "../interfaces/requests.interface.js";
import { escapeMarkdown } from "#/utils/helpers.ts";

const apiClient: AxiosInstance = axios.create({
	baseURL: COINGECKO_API_URL,
	timeout: 10000,
	headers: {
		Accept: "application/json",
		"User-Agent": "Telegram Bot",
	},
});

export const handleGlobalRequest = async () => {
	try {
		const response =
			await apiClient.get<IGlobalStatsRequest>(GLOBAL_STATS_COMMAND);

		const data = response.data.data;

		const lines = [
			`${data?.total_market_cap?.usd ? `🌐 Global Market Stats: ${escapeMarkdown(data.total_market_cap.usd.toLocaleString())}` : ""}`,
			`${data?.total_volume?.usd ? `🕛 24h Volume: ${escapeMarkdown(data.total_volume.usd.toLocaleString())}` : ""}`,
			`${data?.market_cap_percentage?.btc ? `🟩 BTC Dominance: ${escapeMarkdown(data.market_cap_percentage.btc.toFixed(2))}%` : ""}`,
			`${data?.active_cryptocurrencies ? `📈 Active Cryptocurrencies: ${escapeMarkdown(data.active_cryptocurrencies.toString())}` : ""}`,
			`${data?.markets ? `🏛️ Markets: ${escapeMarkdown(data.markets.toString())}` : ""}`,
		];

		const message = lines.join("\n");

		return message;
	} catch (error) {
		console.error(error);
		return "Oh no, something went wrong";
	}
};

export const handleTredingRequest = async () => {
	try {
		const response = await apiClient.get<ITrendingSearchRequest>(
			TRENDING_SEARCH_REQUEST_URL,
		);

		const data = response.data.coins;
		let message = "";

		data.forEach((item, index) => {
			const coin = item.item;
			message +=
				`${index + 1}\. ${escapeMarkdown(coin.name)} \(${escapeMarkdown(coin.symbol.toUpperCase())}) \n` +
				`Market Cap Rank: ${escapeMarkdown(coin.market_cap_rank.toString())} \n` +
				`Price BTC: ${escapeMarkdown(coin.price_btc.toLocaleString())}\n`;
		});

		return message;
	} catch (error) {
		console.error(error);
		return "Oh no, something went wrong";
	}
};

export const handleTop10Request = async () => {
	try {
		const response = await apiClient.get<ITopCoin[]>(
			TOP_10_SEARCH_REQUEST_URL,
		);
		let message = "🔝 Top 10 Cryptocurrencies \n \n";

		response.data.forEach((item, index) => {
			const priceChange = item.price_change_percentage_24h || 0;
			const priceChangeIcon = priceChange >= 0 ? "🟢" : "🔴";

			message += `${index + 1}\. ${escapeMarkdown(item.name)} \(${escapeMarkdown(item.symbol.toUpperCase())}\)`;
			message += `💵 Price: $${escapeMarkdown(item.current_price.toLocaleString())}\n`;
			message += `💰 Price Change: ${priceChangeIcon} ${escapeMarkdown(priceChange.toFixed(2))}\n`;
			message += `🔷 Market Cap: ${escapeMarkdown(item.market_cap.toLocaleString())}\n`;
			message += `📊 Volume: ${escapeMarkdown(item.total_volume.toLocaleString())}\n \n`;
		});

		return message;
	} catch (error) {
		console.error(error);
		return "Oh no, something went wrong";
	}
};
