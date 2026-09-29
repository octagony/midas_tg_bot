import { Keyboard, type CommandContext, type Context } from "grammy";
import {
	GLOBAL_STATS_TEXT,
	PRICE_COIN_TEXT,
	PRICE_TOP_TEXT,
	TRENDING_COIN_TEXT,
} from "./utils/constants.js";

export const setupBasicKeyboard = async (ctx: CommandContext<Context>) => {
	const keyboard = new Keyboard()
		.text(PRICE_COIN_TEXT)
		.row()
		.text(PRICE_TOP_TEXT)
		.row()
		.text(TRENDING_COIN_TEXT)
		.row()
		.text(GLOBAL_STATS_TEXT)
		.row();

	await ctx.reply("Choose what you want", {
		reply_markup: keyboard,
	});
};
