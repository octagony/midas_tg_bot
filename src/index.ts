import { Bot, Keyboard } from "grammy";
import { setupBasicKeyboard } from "./keyboard.js";
import { buttonToCommand } from "./utils/commands.js";
import { START_TEXT } from "./utils/constants.js";
import { handleGlobalRequest } from "./utils/requests.js";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", async (ctx) => {
	ctx.reply(START_TEXT);
	await setupBasicKeyboard(ctx);
});

bot.on("message:text", async (ctx) => {
	const answer = buttonToCommand[ctx.msg.text] ?? ctx.msg.text;

	switch (answer) {
		case PRICE_COIN_COMMAND:
			break;
		default:
			break;
	}

	const message = (await handleGlobalRequest()) ?? "";

	bot.api.sendMessage(ctx.chatId, message);
});

bot.start();
