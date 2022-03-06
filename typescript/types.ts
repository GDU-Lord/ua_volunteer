import { ObjectId } from "mongodb";

export type TELEGRAM = {

    firstName: string,
    botChatId: number,
    telegramUsername?: string,
    telegramId: string,
    picture: string

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
    user: USER,
    _id: ObjectId,
    terminated: boolean,
    created?: Date,
    lastUpdated?: Date

};

export type STATUS = "paused" | "active" | "resolved";
export type HELP_TYPE = "ihelp" | "helpme";

export interface POST {
    _id: ObjectId,                     // telegram user id for the initial version; random id for old versions or
    original_id: string,             // represents telegram user id
    version: number,
    telegram: TELEGRAM,
    telegramUsername?: string,
    botChatId: number,
    status: STATUS,
    deleted: boolean,
    helpType: HELP_TYPE,
    data?: POST_DATA,
    additionalParams?: string,       // start params
    created: Date,
    lastUpdated: Date
}
  
  
export interface POST_DATA {
    message: string,
    city: string,
    phone: string,
    socials: string[],
    id: ObjectId,
    status: STATUS,
    fullName: string,
    title: string,
    date: Date,
    picture: string
}