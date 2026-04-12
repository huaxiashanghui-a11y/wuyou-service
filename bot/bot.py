import os
import logging
from telegram import Update, ReplyKeyboardMarkup, WebAppInfo, KeyboardButton
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.environ.get("BOT_TOKEN", "7965227435:AAFVkenCU8mvMMc_JZ4XGD3T56Tfl1y_pLU")
WEBAPP_URL = os.environ.get("WEBAPP_URL", "https://wyszbot-webapp.vercel.app")
CS_TELEGRAM = "https://t.me/xxx"


def _btn(key, cat):
    return KeyboardButton(text=key, web_app=WebAppInfo(url=f"{WEBAPP_URL}/#/category/{cat}"))


def build_menu():
    r1 = [
        KeyboardButton(text="\U0001f310 \u7f51\u9875\u7248", web_app=WebAppInfo(url=WEBAPP_URL)),
        _btn("\U0001f35c \u7f8e\u98df", "food"),
        _btn("\U0001f3e8 \u9152\u5e97", "hotel"),
        _btn("\U0001f6d2 \u8d2d\u7269", "shopping"),
    ]
    r2 = [
        _btn("\U0001f4b1 \u6362\u6c47", "exchange"),
        _btn("\U0001f4cb \u7b7e\u8bc1", "visa"),
        _btn("\U0001f695 \u6253\u8f66", "taxi"),
        _btn("\U0001f3e0 \u79df\u8d41", "rental"),
    ]
    r3 = [
        _btn("\U0001f3e5 \u533b\u9662", "hospital"),
        _btn("\U0001f3ae \u5a31\u4e50", "entertainment"),
        _btn("\U0001f485 \u7f8e\u989c", "beauty"),
        _btn("\U0001f527 \u5de5\u5177", "tools"),
    ]
    r4 = [
        _btn("\U0001f697 \u8f66\u884c", "car"),
        _btn("\U0001f4e6 \u5feb\u9012", "express"),
        KeyboardButton(text="\U0001f4b9 \u5ba2\u670d"),
    ]
    return ReplyKeyboardMarkup([r1, r2, r3, r4], resize_keyboard=True)


async def start_cmd(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    u = update.effective_user
    txt = (
        f"\U0001f44b \u4f60\u597d\uff0c{u.first_name}\uff01\n\n"
        f"\u6b22\u8fce\u6765\u5230\u3010\u6728\u59d0\u540c\u57ce\u751f\u6d3b\u52a9\u624b\u3011\U0001f916\n\n"
        f"\U0001f31f \u6728\u59d0\u540c\u57ce\u751f\u6d3b\u52a9\u624b\uff0c\u4f60\u7684\u7f05\u5317\u6728\u59d0\u751f\u6d3b\u767e\u4e8b\u901a\uff01\n\n"
        f"\U0001f35c \u7f8e\u98df\u63a8\u8350 | \U0001f3e8 \u9152\u5e97\u4f4f\u5bbf | \U0001f6d2 \u8d2d\u7269\u6307\u5355\n"
        f"\U0001f4b1 \u6362\u6c47\u6c47\u7387 | \U0001f4cb \u7b7e\u8bc1\u529e\u7406 | \U0001f695 \u6253\u8f66\u51fa\u884c\n"
        f"\U0001f3e0 \u623f\u5c4b\u79df\u8d41 | \U0001f3e5 \u533b\u7597\u670d\u52a1 | \U0001f3ae \u4f11\u95f2\u5a31\u4e50\n"
        f"\U0001f485 \u7f8e\u5bb9\u7f8e\u989c | \U0001f527 \u5b9e\u7528\u5de5\u5177 | \U0001f697 \u8f66\u884c\u670d\u52a1\n"
        f"\U0001f4e6 \u5feb\u9012\u7269\u6d41 | \U0001f4b9 \u5728\u7ebf\u5ba2\u670d\n\n"
        f"\U0001f447 \u70b9\u51fb\u4e0b\u65b9\u83dc\u5355\u6309\u94ae\uff0c\u5f00\u59cb\u4f7f\u7528\u5427\uff01"
    )
    await update.message.reply_text(txt, reply_markup=build_menu())


async def handle_msg(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if update.message.text == "\U0001f4b9 \u5ba2\u670d":
        kb = ReplyKeyboardMarkup.from_button(
            KeyboardButton(text="\U0001f517 \u8054\u7cfb\u5ba2\u670d", url=CS_TELEGRAM)
        )
        await update.message.reply_text(
            "\U0001f4de \u8054\u7cfb\u5ba2\u670d\n\n\u70b9\u51fb\u4e0b\u65b9\u6309\u94ae\u8054\u7cfb\u5728\u7ebf\u5ba2\u670d\uff1a",
            reply_markup=kb,
        )
    else:
        await update.message.reply_text(
            "\u8bf7\u4f7f\u7528\u4e0b\u65b9\u83dc\u5355\u6309\u94ae\u9009\u62e9\u670d\u52a1 \U0001f447",
            reply_markup=build_menu(),
        )


def main():
    logger.info("\u6728\u59d0\u540c\u57ce\u751f\u6d3b\u52a9\u624b Bot \u542f\u52a8\u4e2d...")
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start_cmd))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_msg))
    logger.info("Bot \u5df2\u542f\u52a8\uff0c\u7b49\u5f85\u6d88\u606f...")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
