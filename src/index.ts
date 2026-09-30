import { Bot, Keyboard } from "grammy";
import { setupBasicKeyboard } from "./keyboard.js";
import { buttonToCommand } from "./utils/commands.js";
import {
	GLOBAL_STATS_COMMAND,
	START_TEXT,
	TOP_10_COINS_COMMAND,
	TRENDING_COIN_COMMAND,
} from "./utils/constants.js";
import {
	handleGlobalRequest,
	handleTop10Request,
	handleTredingRequest,
} from "./utils/requests.js";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", async (ctx) => {
	ctx.reply(START_TEXT);
	await setupBasicKeyboard(ctx);
});

bot.on("message:text", async (ctx) => {
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
		default:
			message = "Oh no, something went wrong";
			break;
	}

	bot.api.sendMessage(ctx.chatId, message);
});

bot.start();
