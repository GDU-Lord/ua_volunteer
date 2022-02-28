import { ObjectId } from "mongodb";

export type TELEGRAM = {

    firstName: string,
    username: string,
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

export interface SESSION {

    telegramId: string,
    _id: ObjectId,
    terminated: boolean,
    created?: Date,
    lastUpdated?: Date

};