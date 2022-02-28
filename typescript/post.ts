import * as express from "express"
import { ObjectId } from "mongodb";
import { sessions, User } from "./login"; 
import { client } from "./mongo";
import { HELP_TYPE, POST, POST_DATA, STATUS, TELEGRAM, USER } from "./types";

export async function create (req: express.Request, res: express.Response) {

    const session = sessions[req.session.token];

    if(session == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });

    const telegramId = session.telegramId;
    
    let [user] = await client.get("users", { telegramId: telegramId });
    user = new User(user);

    if(user == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });

    const help_type = req.body.help_type;
    const message = req.body.message;
    const city = req.body.city;

    const post = new Post(user, help_type, message, city);

    await client.add("ads", post);

    res.send({
        success: true
    });

}

export class Post implements POST {

    _id: ObjectId;                    // telegram user id for the initial version; random id for old versions or
    original_id: string;             // represents telegram user id
    version: number;
    telegram: TELEGRAM;
    telegramUsername?: string;
    botChatId: number;
    status: STATUS;
    deleted: boolean;
    helpType: HELP_TYPE;
    data: POST_DATA;
    additionalParams?: string;      // start params
    created: Date;
    lastUpdated: Date;

    constructor (user: USER, helpType: HELP_TYPE, message: string, city: string) {
        
        this._id = new ObjectId();
        this.original_id = user.telegramId;
        this.telegram = user.telegram;
        this.telegramUsername = user.telegram.telegramUsername;
        this.botChatId = user.telegram.botChatId;
        this.status = "active";
        this.deleted = false;
        this.helpType = helpType;
        this.data = {
            message: message,
            city: city,
            phone: user.phone,
            socials: user.socials
        };
        this.created = new Date();
        this.lastUpdated = this.created;

    }

}