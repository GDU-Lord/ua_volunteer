"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.verify = exports.receive = exports.BOT_API_TOKEN = void 0;
const telegraf_1 = require("telegraf");
exports.BOT_API_TOKEN = "5280684323:AAF04vPNY9obNv18G_z4xpHhxLim3j-7MDk"; // todo: move to env variables
const ID_PARAM_REGEX = /\/start id_([a-zA-Z0-9]+)/;
const telegraf = new telegraf_1.Telegraf(exports.BOT_API_TOKEN).telegram;
function receive(req, res) {
    const message = req.body?.message;
    const text = message?.text;
    if (!text) { // тут точно має бути "!" ?
        res.sendStatus(200);
    }
    const verificationId = extractIdParam(text);
    const telegramUserId = message?.from?.id;
    const botChatId = message?.chat?.id;
    const telegramUsername = message?.chat?.username;
    const firstName = message?.chat?.first_name;
    const telegram_data = {
        telegramId: message?.from?.id,
        botChatId: message?.chat?.id,
        telegramUsername: message?.chat?.username,
        firstName: message?.chat?.first_name
    };
    const verificationSuccess = check(verificationId, telegram_data, true);
    if (verificationSuccess) {
        telegraf
            .sendMessage(botChatId, 'Реєстрація пройшла успішно!')
            .catch(err => console.log(err))
            .then(() => res.sendStatus(200));
    }
    else {
        telegraf
            .sendMessage(botChatId, 'Помилка реєстрації. Будь ласка, спробуйте ще раз.')
            .catch(err => console.log(err))
            .then(() => res.sendStatus(200));
    }
}
exports.receive = receive;
function extractIdParam(text) {
    const match = text.match(ID_PARAM_REGEX);
    if (!match || match.length < 2) {
        return undefined;
    }
    return match[1];
}
const listeners = [];
function verify(code) {
    return new Promise((res, rej) => {
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
        return false;
    for (const i in listeners) {
        const res = listeners[i](data, code);
        if (res)
            return true;
    }
    return false;
}
exports.check = check;
