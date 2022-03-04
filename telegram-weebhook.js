"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.verify = exports.BOT_API_TOKEN = void 0;
const TelegramBot = require("node-telegram-bot-api");
exports.BOT_API_TOKEN = "5127589339:AAHwaHQaBqWURrsCk2dLR_phFJ---f0s9OE"; // todo: move to env variables
const bot = new TelegramBot(exports.BOT_API_TOKEN, { polling: true });
const ID_PARAM_REGEX = /\/start id_([a-zA-Z0-9]+)/;
// const telegraf = new Telegraf(BOT_API_TOKEN).telegram;
bot.onText(ID_PARAM_REGEX, async (message) => {
    // const message: any = req.body?.message;
    const verificationId = extractIdParam(message.text);
    const telegramUserId = message?.from?.id;
    const botChatId = message?.chat?.id;
    const telegramUsername = message?.chat?.username;
    const firstName = message?.chat?.first_name;
    const telegram_data = {
        telegramId: String(message?.from?.id),
        botChatId: message?.chat?.id,
        telegramUsername: message?.chat?.username,
        firstName: message?.chat?.first_name
    };
    const verificationSuccess = await check(verificationId, telegram_data, true);
    if (verificationSuccess) {
        bot
            .sendMessage(botChatId, 'Реєстрація пройшла успішно!');
    }
    else {
        bot
            .sendMessage(botChatId, 'Помилка реєстрації. Будь ласка, спробуйте ще раз.');
    }
});
function extractIdParam(text) {
    const match = text.match(ID_PARAM_REGEX);
    if (!match || match.length < 2) {
        return undefined;
    }
    return match[1];
}
const listeners = [];
const responses = [];
function verify(code) {
    return new Promise((res, rej) => {
        for (let i in responses) {
            const rs = responses[i](code);
            if (rs)
                return res(rs);
        }
        const index = listeners.length;
        listeners[index] = (data, _code) => {
            if (_code == String(code)) {
                delete listeners[index];
                res(data);
                return true;
            }
            return false;
        };
    });
}
exports.verify = verify;
function check(code, data, success, reason) {
    if (!success)
        return new Promise((res, rej) => res(false));
    for (const i in listeners) {
        const res = listeners[i](data, code);
        if (res)
            return new Promise((res, rej) => res(true));
    }
    return new Promise((res, rej) => {
        const index = listeners.length;
        responses[index] = (_code) => {
            if (code == String(_code)) {
                delete responses[index];
                res(true);
                return data;
            }
            return null;
        };
    });
}
exports.check = check;
