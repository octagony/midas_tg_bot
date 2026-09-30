import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { COINGECKO_API_URL, GLOBAL_STATS_COMMAND } from "./constants.js";
import type {
	IGlobalStatsRequest,
	IPriceCoinRequest,
	ITopCoin,
	ITrendingSearchRequest,
} from "../interfaces/requests.interface.js";
import { escapeMarkdown, handlePriceChange } from "#/utils/helpers.ts";
import { bot } from "#/index.js";
import type { CommandContext, Context } from "grammy";
import { type Conversation } from "@grammyjs/conversations";

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
		const response =
			await apiClient.get<ITrendingSearchRequest>("/search/trending");

		const data = response.data.coins;
		let message = "";

		data.forEach((item, index) => {
			const coin = item.item;
			message +=
				`${index + 1}\. ${escapeMarkdown(coin.name)} \(${escapeMarkdown(coin.symbol.toUpperCase())}) \n` +
				`💸 Market Cap Rank: ${escapeMarkdown(coin.market_cap_rank.toString())} \n` +
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
			"/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
		);
		let message = "🔝 Top 10 Cryptocurrencies \n \n";

		response.data.forEach((item, index) => {
			const { priceChange, priceChangeIcon } = handlePriceChange(item);

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

export const handlePriceRequest = async (
	conversation: Conversation,
	ctx: CommandContext<Context>,
) => {
	await bot.api.sendMessage(ctx.chatId, "Type coin", {
		reply_markup: { remove_keyboard: true },
	});

	const answerCtx = await conversation.waitFor("message:text");
	ctx.reply(`You said: ${answerCtx.msg.text}`);

	try {
		const coinResponse = await apiClient.get<IPriceCoinRequest>(
			`/search?query=${answerCtx.msg.text}`,
		);

		if (!coinResponse.data.coins || !coinResponse?.data?.coins.at(0)) {
			return "No coin found";
		}

		const coinId = coinResponse?.data?.coins.at(0)?.id;

		const specificCoinResponse = await apiClient.get(
			`/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
		);

		const coinData = specificCoinResponse?.data;

		const { priceChange, priceChangeIcon } = handlePriceChange(coinData);

		const lines = [
			`💰 ${escapeMarkdown(coinData.name)} \(${escapeMarkdown(coinData.symbol.toUpperCase())}\)`,
			`🏷️ ${priceChangeIcon} 24h Price: ${priceChange.toFixed(2)}%`,
			`📈 24h High: $${escapeMarkdown(coinData.market_data.high_24h.usd.toLocaleString())}`,
			`📉 24h Low: $${escapeMarkdown(coinData.market_data.low_24h.usd.toLocaleString())}`,
			`🔷 Market Cap: $${escapeMarkdown(coinData.market_data.market_cap.usd.toLocaleString())}`,
			`💸 Market Cap Rank: #${coinData.market_cap_rank}`,
			`📊 Volume: $${escapeMarkdown(coinData.market_data.total_volume.usd.toLocaleString())}`,
		];

		const message = lines.join("\n");

		await bot.api.sendMessage(ctx.chatId, message);
	} catch (error) {
		console.error(error);
		return "Oh no, something went wrong";
	}
};
