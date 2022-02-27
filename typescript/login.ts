import * as express from "express";
import * as telegram from "./telegram";
import { ObjectId } from "mongodb";

type USER = {

    fullname: string,
    phone: string,
    socials: string[],
    ip?: string,
    id?: ObjectId,
    code?: ObjectId,
    telegram?: {
        firstname: string,
        lastname: string,
        code: number,

    }

};

export const pending_users = {};

export function signup (req: express.Request, res: express.Response) {

    const user = req.body as USER;
    user.id = new ObjectId();
    user.code = new ObjectId();

    pending_users[String(user.code)] = user;

    console.log(user);

    res.send(user);

}

export async function isVerified (req: express.Request, res: express.Response) {

    const code = req.query.code as string;
    const user = pending_users[code];

    if(user == null)
        return res.send(false);

    const v = await telegram.verify(user);

    if(v)
        delete pending_users[code];
    
    res.send(v);

}

export function random () {
    return Math.floor(Math.random()*10).toString();
}

export function getCode () {
    const code = random()+random()+random()+random();
    if(code in pending_users)
        return getCode();
    return code;
}