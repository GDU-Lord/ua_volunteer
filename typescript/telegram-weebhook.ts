import * as express from "express";
// import {Telegraf} from "telegraf";
import { TELEGRAM, USER } from "./types";
import { ObjectId } from "mongodb";
import * as TelegramBot from "node-telegram-bot-api";
import { env } from "./index";
import { client } from "./mongo";

export const BOT_API_TOKEN = env.token;    // todo: move to env variables

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

  const user_profile = await bot.getUserProfilePhotos(message?.from?.id);
  let photo_url;

  if(user_profile.photos.length > 0) {
    const file_id = user_profile.photos[0][0].file_id;
    const file = await bot.getFile(file_id);
    const file_path = file.file_path;
    photo_url = `https://api.telegram.org/file/bot${BOT_API_TOKEN}/${file_path}`;
  }

  const telegram_data: TELEGRAM = {
    telegramId: String(message?.from?.id),
    botChatId: message?.chat?.id,
    telegramUsername: message?.chat?.username,
    firstName: message?.chat?.first_name,
    picture: photo_url
  };

  let verificationSuccess = await check(verificationId, telegram_data, true);

  if (verificationSuccess) {
    bot
      .sendMessage(botChatId, 'Верифікація пройшла успішно! Повертайтеся на сайт.\n\nВам будуть надходити сповіщення в цей чат.');
  } else {
    bot
      .sendMessage(botChatId, 'Помилка верифікації! Можливо номер телефону неправильний. Перевірте свої дані на сайті і спробуйте ще раз.');
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

export function verify(user: USER, signup: boolean = true) {

  return new Promise<TELEGRAM>((res, rej) => {

    for(let i in responses) {

      const rs = responses[i](user.code) as TELEGRAM;
      if(rs) {
        if(!signup && user.telegramId != rs.telegramId)
          return false;
        return res(rs);
      }

    }

    const index = listeners.length;

    listeners[index] = (data: TELEGRAM, _code: string) => {

      if (_code == String(user.code)) {

        if(!signup && user.telegramId != data.telegramId)
          return false;

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
    else
      return new Promise<boolean>((res, rej) => res(false));
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
