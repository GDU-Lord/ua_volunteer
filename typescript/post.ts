import * as express from "express"
import { ObjectId } from "mongodb";
import { sessions, User } from "./login"; 
import { client } from "./mongo";
import { HELP_TYPE, POST, POST_DATA, SESSION, STATUS, TELEGRAM, USER } from "./types";
import * as fs from "fs";
import { session } from "telegraf";

export async function create (req: express.Request, res: express.Response) {

    const session = sessions[req.session.token];

    const [helpme] = await client.get("posts", { "telegram.telegramId": session.telegramId, helpType: "helpme" });
    const [ihelp] = await client.get("posts", { "telegram.telegramId": session.telegramId, helpType: "ihelp" });
    
    const user = await getUser(session, res);

    const help_type = req.body.help_type;
    const message = req.body.message;
    const city = req.body.city;
    const status = req.body.status;

    if((helpme != null && help_type == "helpme") || (ihelp != null && help_type == "ihelp"))
        res.send({
            success: false,
            reason: "too-many-ads"
        });

    const post = new Post(user, help_type, message, city, status);

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
    const status = req.body.status;

    let [post] = await client.get("posts", { _id: id }) as POST[];
    if(post == null)
        return res.send({
            success: false,
            reason: "post-not-found"
        });
    
    post = new Post(user, help_type, message, city, status, post._id);

    await client.update("posts", post._id, post);

    res.send({
        success: true
    });

}

export async function getUser (session, res: express.Response) {

    let user = session.user;

    if(user == null) {
        res.send({
            success: false,
            reason: "access-denied"
        });
    }
    
    user = new User(user);

    return user;

}

export async function getHelpMe (req: express.Request, res: express.Response) {

    try {

        const page: number = +req.query.page || 0;
        const city: string = req.query.city as string || "";
        const offset = page * 5;

        let posts;
        let all;
        const data = [];

        if(city == "Всі міста") {
            posts = await client.get("posts", { helpType: "helpme", status: "active" }, 5, offset);
            all = await client.get("posts", { helpType: "helpme", status: "active" }, 0);
        }
        else {
            posts = await client.get("posts", { helpType: "helpme", status: "active", "data.city": city }, 5, offset);
            all = await client.get("posts", { helpType: "helpme", status: "active", "data.city": city }, 0);
        }


        for(const i in posts) {
            data.push(posts[i].data);
        }

        res.send({
            success: true,
            posts: data,
            count: Math.floor(all.length/5)
        });

    } catch (err) {

        res.send({
            success: true,
            reason: err
        });

    }

}

export async function getIHelp (req: express.Request, res: express.Response) {

    try {

        const page: number = +req.query.page || 0;
        const city: string = req.query.city as string || "";
        const offset = page * 5;

        let posts;
        let all;
        const data = [];

        if(city == "Всі міста") {
            posts = await client.get("posts", { helpType: "ihelp", status: "active" }, 5, offset);
            all = await client.get("posts", { helpType: "ihelp", status: "active" }, 0);
        }
        else {
            posts = await client.get("posts", { helpType: "ihelp", status: "active", "data.city": city }, 5, offset);
            all = await client.get("posts", { helpType: "ihelp", status: "active", "data.city": city }, 0);
        }

        for(const i in posts) {
            data.push(posts[i].data);
        }

        res.send({
            success: true,
            posts: data,
            count: Math.floor(all.length/5)
        });

    } catch (err) {

        res.send({
            success: true,
            reason: err
        });

    }

}

export async function getMyPosts (req: express.Request, res: express.Response) {

    const session = sessions[req.session.token] as SESSION;

    const [helpme] = await client.get("posts", { "telegram.telegramId": session.telegramId, helpType: "helpme" });
    const [ihelp] = await client.get("posts", { "telegram.telegramId": session.telegramId, helpType: "ihelp" });

    res.send({
        success: true,
        helpme: helpme?.data,
        ihelp: ihelp?.data
    });

}

export async function upload (req: express.Request, res: express.Response) {

    if(req.file == null)
        return res.send({
            success: false,
            reason: "input-error"
        });

    const oldname = req.file.filename;
    const newname = oldname + "." + req.file.mimetype.split("/")[1];//req.file.originalname;

    fs.renameSync(__dirname + "/files/" + oldname, __dirname + "/files/" + newname);

    res.send({

        success: true,
        file: {
            url: "/image/" + newname
        }

    });

}

export function image (req: express.Request, res: express.Response) {

    const path = req.originalUrl.replace("image/", "");

    res.sendFile(__dirname + "/files/" + path);

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

    constructor (user: USER, helpType: HELP_TYPE, message: string, city: string, status: STATUS, id: ObjectId = null) {
        
        if(id == null)
            this._id = new ObjectId();
        else
            this._id = new ObjectId(id);
        this.original_id = user.telegramId;
        this.telegram = user.telegram;
        this.telegramUsername = user.telegram.telegramUsername;
        this.botChatId = user.telegram.botChatId;
        this.status = status;
        this.deleted = false;
        this.helpType = helpType;
        this.data = {
            message: message,
            city: city,
            phone: user.phone,
            fullName: user.fullName,
            socials: user.socials,
            date: new Date(),
            status: status,
            id: this._id
        };
        this.created = new Date();
        this.lastUpdated = this.created;

    }

}