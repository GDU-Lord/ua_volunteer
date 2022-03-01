import * as express from "express";
import {Telegraf} from "telegraf";
import { TELEGRAM } from "./types";
import { ObjectId } from "mongodb";


export const BOT_API_TOKEN = "5280684323:AAF04vPNY9obNv18G_z4xpHhxLim3j-7MDk";        // todo: move to env variables

const ID_PARAM_REGEX = /\/start id_([a-zA-Z0-9]+)/;
const telegraf = new Telegraf(BOT_API_TOKEN).telegram;

export async function receive(req: express.Request, res: express.Response) {
  const message: any = req.body?.message;
  const text = message?.text;

  if (!text) { // тут точно має бути "!" ?
    res.sendStatus(200);
  }

  const verificationId = extractIdParam(text);
  const telegramUserId = message?.from?.id;
  const botChatId = message?.chat?.id;
  const telegramUsername = message?.chat?.username;
  const firstName = message?.chat?.first_name;

  const telegram_data: TELEGRAM = {
    telegramId: message?.from?.id,
    botChatId: message?.chat?.id,
    telegramUsername: message?.chat?.username,
    firstName: message?.chat?.first_name
  };

  const verificationSuccess = await check(verificationId, telegram_data, true);
  
  if (verificationSuccess) {
    telegraf
      .sendMessage(botChatId, 'Реєстрація пройшла успішно!')
      .catch(err => console.log(err))
      .then(() => res.sendStatus(200));
  } else {
    telegraf
      .sendMessage(botChatId, 'Помилка реєстрації. Будь ласка, спробуйте ще раз.')
      .catch(err => console.log(err))
      .then(() => res.sendStatus(200));
  }
}

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
