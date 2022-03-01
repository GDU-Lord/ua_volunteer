import * as express from "express"
import { ObjectId } from "mongodb";
import { sessions, User } from "./login"; 
import { client } from "./mongo";
import { HELP_TYPE, POST, POST_DATA, STATUS, TELEGRAM, USER } from "./types";

export async function create (req: express.Request, res: express.Response) {

    const session = sessions[req.session.token];
    
    const user = await getUser(session, res);

    const help_type = req.body.help_type;
    const message = req.body.message;
    const city = req.body.city;

    const post = new Post(user, help_type, message, city);

    await client.add("posts", post);

    res.send({
        success: true
    });

}

export async function update (req: express.Request, res: express.Response) {

    const session = sessions[req.session.token];
    
    const user = await getUser(session, res);

    const help_type = req.body.help_type;
    const message = req.body.message;
    const city = req.body.city;
    const id = new ObjectId(req.body.id);

    let [post] = await client.get("posts", { _id: id }) as POST[];
    if(post == null)
        return res.send({
            success: false,
            reason: "post-not-found"
        });
    
    post = new Post(user, help_type, message, city, post._id);

    await client.update("posts", post._id, post);

    res.send({
        success: true
    });

}

export async function getUser (session, res: express.Response) {

    let [user] = await client.get("users", { telegramId: session.telegramId }) as USER[];
    user = new User(user);

    if(user == null) {
        res.send({
            success: false,
            reason: "access-denied"
        });
    }

    return user;

}

export async function getPosts (req: express.Request, res: express.Response) {

    try {

        const posts = await client.get("posts", {}, 0);

        res.send({
            success: true,
            posts: posts
        });

    } catch (err) {

        res.send({
            success: true,
            reason: err
        });

    }

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

    constructor (user: USER, helpType: HELP_TYPE, message: string, city: string, id: ObjectId = null) {
        
        if(id == null)
            this._id = new ObjectId();
        else
            this._id = new ObjectId(id);
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
            socials: user.socials,
            id: this._id
        };
        this.created = new Date();
        this.lastUpdated = this.created;

    }

}