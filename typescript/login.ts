import * as express from "express";
import { ObjectId } from "mongodb";
import { USER, SESSION, TELEGRAM } from "./types";
import { client } from "./mongo";
import * as telegramWebhook from "./telegram-weebhook";

export const pending_users = {};
export const sessions = {};

export async function signup (req: express.Request, res: express.Response) {

    if(sessions[req.session.token] != null)
        return res.send({
            success: false,
            reason: "logged-in"
        });

    let user = req.body as USER;
    user._id = new ObjectId();
    user.code = new ObjectId();

    user = new User(user);

    const [u] = await client.get("users", { phone: user.phone });

    if(u != null)
        return res.send({
            success: false,
            reason: "phone-exists"
        });

    pending_users[String(user.code)] = user;

    res.send({
        success: true,
        code: user.code
    });

}

export async function login (req: express.Request, res: express.Response) {

    if(sessions[req.session.token] != null)
        return res.send({
            success: false,
            reason: "logged-in"
        });

    const phone = req.body.phone;
    let [user] = await client.get("users", { phone: phone }) as USER[];

    if(user == null)
        return res.send({
            success: false,
            reason: "phone-not-found"
        });

    user = new User(user);

    user.code = new ObjectId();

    pending_users[String(user.code)] = user;
    
    res.send({
        success: true,
        code: user.code
    });

}

export async function isVerifiedSignup (req: express.Request, res: express.Response) {

    if(sessions[req.session.token] != null)
        return res.send({
            success: false,
            reason: "logged-in"
        });

    const code = req.query.code as string;
    const user = pending_users[code] as USER;

    if(user == null)
        return res.send({
            success: false,
            reason: "insufficient-code"
        });

    user.telegram = await telegramWebhook.verify(user);
    delete pending_users[code];

    if(user.telegram) {

        user.telegramId = user.telegram.telegramId;
        
        const [u] = await client.get("users", {
            telegramId: user.telegramId
        });

        if(u != null)
            return res.send({
                success: false,
                reason: "telegram-exists"
            });

        await client.add("users", user);

        const session = new Session(user);
        req.session.token = session._id;

        return res.send({
            success: true,
            user: user
        });

    }
    
    res.send({
        success: false,
        reason: "bot-error"
    });

}

export async function isVerifiedLogin (req: express.Request, res: express.Response) {

    if(sessions[req.session.token] != null)
        return res.send({
            success: false,
            reason: "logged-in"
        });

    const code = req.query.code as string;
    const user = pending_users[code] as USER;

    if(user == null)
        return res.send({
            success: false,
            reason: "insufficient-code"
        });

    user.telegram = await telegramWebhook.verify(user, false);
    delete pending_users[code];

    if(user.telegram) {

        user.telegramId = user.telegram.telegramId;
        
        const [u] = await client.get("users", {
            telegramId: user.telegramId
        });

        if(u == null)
            return res.send({
                success: false,
                reason: "telegram-not-found"
            });

        if(u.telegramId != user.telegramId)
            return res.send({
                success: false,
                reason: "wrong-telegram"
            });
        
        let session = Session.find(user.telegramId);
        if(session != null)
            session.terminate();
        
        session = new Session(user);
        req.session.token = session._id;

        return res.send({
            success: true,
            user: user
        });

    }
    
    res.send({
        success: false,
        reason: "bot-error"
    });

}

export async function logout (req: express.Request, res: express.Response) {

    if(req.session.token != null) {
        req.session.token = null;
        res.send({
            success: true
        });
    }
    else
        res.send({
            success: false,
            reason: "session-not-found"
        });

}

export function verify (req: express.Request, res: express.Response, next) {

    const token = req.session.token;
    const session = sessions[token];

    if(session == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });

    next();

}

export async function getUser (req: express.Request, res: express.Response, next) {

    const token = req.session.token;
    const session = sessions[token];

    let user = session.user;
    
    if(user == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });

    user = new User(user);

    res.send({
        success: true,
        user: user
    });

}

export class User implements USER {

    fullName: string;
    phone: string;
    socials: string[];
    telegram: TELEGRAM;
    telegramId: string;

    constructor (user: USER) {
        this.fullName = user?.fullName || "";
        this.phone = user?.phone || "";
        this.socials = user?.socials || [];
        this.telegram = user?.telegram || null;
        this.telegramId = user?.telegramId || null;
    }

}

export class Session implements SESSION {

    static find (telegramId) {

        for(const i in sessions) {
            if(sessions[i].telegramId == telegramId)
                return sessions[i];
        }

        return null;

    }

    telegramId: string;
    _id: ObjectId;
    created: Date;
    terminated: boolean;
    user: USER;

    constructor (user: USER) {

        this._id = new ObjectId();
        this.telegramId = user?.telegramId;
        this.created = new Date();
        this.terminated = false;
        this.user = user;
        sessions[String(this._id)] = this;

    }

    terminate () {

        this.terminated = true;
        delete sessions[String(this._id)];

    }

}