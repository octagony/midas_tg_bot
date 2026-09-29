import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { COINGECKO_API_URL, GLOBAL_STATS_COMMAND } from "./constants.js";
import type { IGlobalStats } from "#/interfaces/requests.interface.js";
import { escapeMarkdown } from "#/utils/helpers.ts";

const apiClient: AxiosInstance = axios.create({
	baseURL: COINGECKO_API_URL,
	timeout: 10000,
});

export const handleGlobalRequest = async () => {
	try {
		const response =
			await apiClient.get<AxiosResponse<IGlobalStats>>(
				GLOBAL_STATS_COMMAND,
			);

		const data = response.data.data;

		const lines = [
			`🌐 Global Market Stats: ${escapeMarkdown(data.total_market_cap.usd.toLocaleString())}`,
			`🕛 24h Volume: ${escapeMarkdown(data.total_volume.usd.toLocaleString())}`,
			`🟩 BTC Dominance: ${escapeMarkdown(data.market_cap_percentage.btc.toFixed(2))}%`,
			`📈 Active Cryptocurrencies: ${escapeMarkdown(data.active_cryptocurrencies.toString())}`,
			`🏛️ Markets: ${escapeMarkdown(data.markets.toString())}`,
		];

		const message = lines.join("\n");

		return message;
	} catch (error) {
		console.error(error);
		return "Oh no, something went wrong";
	}
};
