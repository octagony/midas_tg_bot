import { Bot, Keyboard } from "grammy";
import { setupBasicKeyboard } from "./keyboard.js";
import { buttonToCommand } from "./utils/commands.js";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", async (ctx) => {
	ctx.reply(`Welcome to Midas Bot! 🚀 \n`);
	await setupBasicKeyboard(ctx);
});

bot.start();
