import * as express from "express";
import * as telegram from "./telegram";
import { ObjectId } from "mongodb";
import { USER } from "./types";
import { client } from "./mongo";
import { SESSION } from "./types";

export const pending_users = {};
export const sessions = {};

export async function signup (req: express.Request, res: express.Response) {

    const user = req.body as USER;
    user._id = new ObjectId();
    user.code = new ObjectId();

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

    const phone = req.body.phone;
    const [user] = await client.get("users", { phone: phone });

    if(user == null)
        return res.send({
            success: false,
            reason: "phone-not-found"
        });

    user.code = new ObjectId();

    pending_users[String(user.code)] = user;
    
    res.send({
        success: true,
        code: user.code
    });

}

export async function isVerifiedSignup (req: express.Request, res: express.Response) {

    const code = req.query.code as string;
    const user = pending_users[code] as USER;

    if(user == null)
        return res.send({
            success: false,
            reason: "insufficient-code"
        });

    user.telegram = await telegram.verify(user.code);
    delete pending_users[code];

    if(user.telegram) {

        user.telegramId = user.telegram.id;
        
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

    const code = req.query.code as string;
    const user = pending_users[code] as USER;

    if(user == null)
        return res.send({
            success: false,
            reason: "insufficient-code"
        });

    user.telegram = await telegram.verify(user.code);
    delete pending_users[code];

    if(user.telegram) {

        user.telegramId = user.telegram.id;
        
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

    next(req, res);

}

class Session implements SESSION {

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

    constructor (user: USER) {

        this._id = new ObjectId();
        this.telegramId = user.telegramId;
        this.created = new Date();
        this.terminated = false;
        sessions[String(this._id)] = this;

    }

    terminate () {

        this.terminated = true;
        delete sessions[String(this._id)];

    }

}