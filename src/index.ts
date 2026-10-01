import { Bot, Context, Keyboard, session, type CommandContext } from "grammy";
import { setupBasicKeyboard } from "#/utils/keyboard.ts";
import { buttonToCommand } from "#/utils/commands.ts";
import {
	GLOBAL_STATS_COMMAND,
	PRICE_COIN_COMMAND,
	START_TEXT,
	TOP_10_COINS_COMMAND,
	TRENDING_COIN_COMMAND,
} from "#/utils/constants.ts";
import {
	handleGlobalRequest,
	handlePriceRequest,
	handleTop10Request,
	handleTredingRequest,
} from "#/utils/requests.ts";
import {
	conversations,
	createConversation,
	type ConversationFlavor,
} from "@grammyjs/conversations";

export const bot = new Bot<ConversationFlavor<Context>>(
	process.env.TELEGRAM_BOT_TOKEN!,
);

bot.use(conversations());

bot.command("start", async (ctx) => {
	const basicKeyboard = await setupBasicKeyboard();

	await ctx.reply(`${START_TEXT}`, {
		reply_markup: basicKeyboard,
	});
});

bot.use(createConversation(handlePriceRequest));

bot.command("price", async (ctx) => {
	await ctx.conversation.enter("handlePriceRequest");
});

bot.on("message:text", async (ctx) => {
	if (ctx.msg.text.startsWith("/")) {
		return;
	}

	const answer = buttonToCommand[ctx.msg.text] ?? ctx.msg.text;
	let message: string;

	switch (answer) {
		case GLOBAL_STATS_COMMAND:
			message = (await handleGlobalRequest()) ?? "";
			bot.api.sendMessage(ctx.chatId, message, {
				parse_mode: "MarkdownV2",
			});
			break;
		case TRENDING_COIN_COMMAND:
			message = (await handleTredingRequest()) ?? "";
			bot.api.sendMessage(ctx.chatId, message, {
				parse_mode: "MarkdownV2",
			});
			break;
		case TOP_10_COINS_COMMAND:
			message = (await handleTop10Request()) ?? "";
			bot.api.sendMessage(ctx.chatId, message, {
				parse_mode: "MarkdownV2",
			});
			break;
		case PRICE_COIN_COMMAND:
			await ctx.conversation.enter("handlePriceRequest");
			break;
		default:
			message = "Unknown message";
			break;
	}
});

bot.start();
