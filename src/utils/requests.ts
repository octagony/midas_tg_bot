import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import {
	COINGECKO_API_URL,
	GLOBAL_STATS_COMMAND,
	TRENDING_SEARCH_REQUEST_URL,
} from "./constants.js";
import type {
	IGlobalStatsRequest,
	ITrendingSearchRequest,
} from "../interfaces/requests.interface.js";
import { escapeMarkdown } from "#/utils/helpers.ts";

const apiClient: AxiosInstance = axios.create({
	baseURL: COINGECKO_API_URL,
	timeout: 10000,
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
