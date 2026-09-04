import { Bot, webhookCallback } from "grammy";

// Fallback for build time if token is not available. 
// Do not throw to prevent breaking the build.
const token = process.env.TELEGRAM_BOT_TOKEN || "123456789:dummy_token_for_build";
const bot = new Bot(token);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kitobxon.uz";

bot.command("start", async (ctx) => {
  const startPayload = ctx.match;
  let msg = "Assalomu alaykum! ✨\n\n**KITOBXON** platformasiga xush kelibsiz!\n\nBizning maqsadimiz oddiy:\n*Kitobni shunchaki o'qimang. Undan o'zingizning buyuk fikrlaringizni yarating va ulashing!*\n\nSiz bu yerda:\n📚 Yangi asarlarni kashf etishingiz\n✍️ O'qiganlaringizdan xulosalar yozishingiz\n👥 Fikrlar orqali boshqalar bilan ulashishingiz mumkin.";
  if (startPayload && startPayload.startsWith("book_")) {
    msg += "\n\nSizni ma'lum bir kitob qiziqtirgan ko'rinadi. Ilovani ochib ko'rishingiz mumkin! 👇";
  }
  await ctx.reply(msg, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[{ text: "📱 Ilovani ochish", web_app: { url: APP_URL } }]]
    }
  });
});

bot.command("help", async (ctx) => {
  await ctx.reply("Yordam kerak bo'lsa @kitobxon_support ga yozing.\n\nBuyruqlar:\n/start - Ilovani ochish\n/profile - Profil\n/books - Kitoblar\n/reading - O'qilayotganlar");
});

bot.command("profile", async (ctx) => {
  await ctx.reply("Profilingizni ko'rish uchun ilovani oching:", {
    reply_markup: { inline_keyboard: [[{ text: "👤 Profil", web_app: { url: `${APP_URL}/profile` } }]] }
  });
});

bot.command("books", async (ctx) => {
  await ctx.reply("Katalogni kashf etish:", {
    reply_markup: { inline_keyboard: [[{ text: "📚 Kitoblar", web_app: { url: `${APP_URL}/search` } }]] }
  });
});

bot.command("reading", async (ctx) => {
  await ctx.reply("O'qilayotgan kitoblaringiz:", {
    reply_markup: { inline_keyboard: [[{ text: "📖 O'qish", web_app: { url: `${APP_URL}/profile` } }]] }
  });
});

export const POST = webhookCallback(bot, "std/http");
