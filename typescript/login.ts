import * as express from "express";
import { ObjectId } from "mongodb";
import { USER, SESSION, TELEGRAM } from "./types";
import { client } from "./mongo";
import * as telegramWebhook from "./telegram-weebhook";
import { env } from "./index";
import { Post } from "./post";

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

    let [banned] = await client.get("blacklist", { phone: user.phone });

    if(banned != null)
        return res.send({
            success: false,
            reason: "banned"
        });

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

    let [banned] = await client.get("blacklist", { phone: phone });

    if(banned != null)
        return res.send({
            success: false,
            reason: "banned"
        });

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

export async function isAdmin (req: express.Request, res: express.Response) {

    const token = req.session.token;
    const session = sessions[token];

    let user = session.user;
    
    if(user == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });

    user = new User(user);

    if(user.admin === env.admin)
        return res.send({
            success: true
        });
    
    return res.send({
        success: false,
        reason: "access-denied"
    });

}

export async function verifyAdmin (req: express.Request, res: express.Response, next) {

    const token = req.session.token;
    const session = sessions[token];

    let user = session.user;
    
    if(user == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });

    user = new User(user);

    if(user.admin === env.admin)
        next();
    else
        return res.send({
            success: false,
            reason: "access-denied"
        });

}

export async function ban (req: express.Request, res: express.Response) {
    
    let id = new ObjectId(req.body.id);

    let [post] = await client.get("posts", { _id: id }) as Post[];
    
    if(post == null)
        return res.send({
            success: false,
            reason: "not-found"
        });

    const telegramId = post.telegram.telegramId

    let [user] = await client.get("users", { telegramId: telegramId });
    
    if(user == null)
        return res.send({
            success: false,
            reason: "not-found"
        });

    user = new User(user);

    await client.add("blacklist", user);

    const posts = await client.get("posts", { "telegram.telegramId": user.telegramId });

    for(const post of posts) {

        await client.add("archive", post);
        await client.remove("posts", post._id);

    }

    for(const i in sessions) {

        const session = sessions[i] as Session;

        if(session.telegramId == telegramId)
            session.terminate();

    }

    res.send({
        success: true
    });

}

export async function remove (req: express.Request, res: express.Response) {
    
    let id = new ObjectId(req.body.id);

    let [post] = await client.get("posts", { _id: id });
    
    if(post == null)
        return res.send({
            success: false,
            reason: "not-found"
        });

    await client.remove("posts", id);

    res.send({
        success: true
    });

}

export class User implements USER {

    fullName: string;
    phone: string;
    socials: string[];
    telegram: TELEGRAM;
    telegramId: string;
    admin: string;

    constructor (user: USER) {
        this.fullName = user?.fullName || "";
        this.phone = user?.phone || "";
        this.socials = user?.socials || [];
        this.telegram = user?.telegram || null;
        this.telegramId = user?.telegramId || null;
        this.admin = user?.admin || "";
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