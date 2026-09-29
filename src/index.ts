import { Bot, Keyboard } from "grammy";
import { setupBasicKeyboard } from "./keyboard.js";
import { buttonToCommand } from "./utils/commands.js";
import {
	GLOBAL_STATS_COMMAND,
	START_TEXT,
	TRENDING_COIN_COMMAND,
} from "./utils/constants.js";
import { handleGlobalRequest, handleTredingRequest } from "./utils/requests.js";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", async (ctx) => {
	ctx.reply(START_TEXT);
	await setupBasicKeyboard(ctx);
});

bot.on("message:text", async (ctx) => {
	const answer = buttonToCommand[ctx.msg.text] ?? ctx.msg.text;
	let message: string;

	switch (answer) {
		case GLOBAL_STATS_COMMAND:
			message = (await handleGlobalRequest()) ?? "";
			break;
		case TRENDING_COIN_COMMAND:
			message = (await handleTredingRequest()) ?? "";
			break;
		default:
			message = "Oh no, something went wrong";
			break;
	}

	bot.api.sendMessage(ctx.chatId, message);
});

bot.start();
