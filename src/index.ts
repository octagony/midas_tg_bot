import { Bot, Context, Keyboard, session } from "grammy";
import { setupBasicKeyboard } from "./keyboard.js";
import { buttonToCommand } from "./utils/commands.js";
import {
	GLOBAL_STATS_COMMAND,
	PRICE_COIN_COMMAND,
	START_TEXT,
	TOP_10_COINS_COMMAND,
	TRENDING_COIN_COMMAND,
} from "./utils/constants.js";
import {
	handleGlobalRequest,
	handlePriceRequest,
	handleTop10Request,
	handleTredingRequest,
} from "./utils/requests.js";
import {
	conversations,
	createConversation,
	type ConversationFlavor,
} from "@grammyjs/conversations";

export const bot = new Bot<ConversationFlavor<Context>>(
	process.env.TELEGRAM_BOT_TOKEN!,
);
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

bot.command("start", async (ctx) => {
	ctx.reply(START_TEXT);
	await setupBasicKeyboard(ctx);
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

	console.log(answer);

	switch (answer) {
		case GLOBAL_STATS_COMMAND:
			message = (await handleGlobalRequest()) ?? "";
			break;
		case TRENDING_COIN_COMMAND:
			message = (await handleTredingRequest()) ?? "";
			break;
		case TOP_10_COINS_COMMAND:
			message = (await handleTop10Request()) ?? "";
			break;
		case PRICE_COIN_COMMAND:
			await ctx.conversation.enter("handlePriceRequest");
			message = "inside switch";
			break;
		default:
			message = "inside default";
			break;
	}

	bot.api.sendMessage(ctx.chatId, message);
});

bot.start();
