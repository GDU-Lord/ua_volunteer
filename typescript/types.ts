import { ObjectId } from "mongodb";

export type TELEGRAM = {

    firstname: string,
    lastname: string,
    id: string

}

export type USER = {

    fullName: string,
    phone: string,
    socials: string[],
    ip?: string,
    _id?: ObjectId,
    code?: ObjectId,
    sessionId?: ObjectId,
    telegram?: TELEGRAM
    telegramId: string

};