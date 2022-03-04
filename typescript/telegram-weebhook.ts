import * as express from "express";
// import {Telegraf} from "telegraf";
import { TELEGRAM } from "./types";
import { ObjectId } from "mongodb";
import * as TelegramBot from "node-telegram-bot-api";

export const BOT_API_TOKEN = "5127589339:AAHwaHQaBqWURrsCk2dLR_phFJ---f0s9OE";    // todo: move to env variables

const bot = new TelegramBot(BOT_API_TOKEN, {polling: true});

const ID_PARAM_REGEX = /\/start id_([a-zA-Z0-9]+)/;
// const telegraf = new Telegraf(BOT_API_TOKEN).telegram;

bot.onText(ID_PARAM_REGEX, async (message) => {
  // const message: any = req.body?.message;

  const verificationId = extractIdParam(message.text);
  const telegramUserId = message?.from?.id;
  const botChatId = message?.chat?.id;
  const telegramUsername = message?.chat?.username;
  const firstName = message?.chat?.first_name;

  const telegram_data: TELEGRAM = {
    telegramId: String(message?.from?.id),
    botChatId: message?.chat?.id,
    telegramUsername: message?.chat?.username,
    firstName: message?.chat?.first_name
  };

  const verificationSuccess = await check(verificationId, telegram_data, true);
  
  if (verificationSuccess) {
    bot
      .sendMessage(botChatId, 'Реєстрація пройшла успішно!');
  } else {
    bot
      .sendMessage(botChatId, 'Помилка реєстрації. Будь ласка, спробуйте ще раз.');
  }
});

function extractIdParam(text: string): string | undefined {
  const match = text.match(ID_PARAM_REGEX);
  if (!match || match.length < 2) {
    return undefined;
  }
  return match[1];
}

const listeners = [];
const responses = [];

export function verify(code: ObjectId) {

  return new Promise<TELEGRAM>((res, rej) => {

    for(let i in responses) {

      const rs = responses[i](code) as TELEGRAM;
      if(rs)
        return res(rs);

    }

    const index = listeners.length;

    listeners[index] = (data: TELEGRAM, _code: string) => {

      if (_code == String(code)) {

        delete listeners[index];
        res(data);

        return true;
      }

      return false;

    };

  });

}

export function check(code: string, data: TELEGRAM, success: boolean, reason?: string) {

  if (!success)
    return new Promise<boolean>((res, rej) => res(false));

  for (const i in listeners) {
    const res = listeners[i](data, code);
    if (res)
      return new Promise<boolean>((res, rej) => res(true));
  }

  return new Promise<boolean>((res, rej) => {

    const index = listeners.length;

    responses[index] = (_code: ObjectId) => {

      if(code == String(_code)) {
        delete responses[index];
        res(true);
        return data;
      }

      return null;

    };

  });
}
