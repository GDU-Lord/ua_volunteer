"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.image = exports.upload = exports.getMyPosts = exports.getIHelp = exports.getHelpMe = exports.getUser = exports.remove = exports.update = exports.create = void 0;
const mongodb_1 = require("mongodb");
const login_1 = require("./login");
const mongo_1 = require("./mongo");
const fs = require("fs");
async function create(req, res) {
    const session = login_1.sessions[req.session.token];
    const [helpme] = await mongo_1.client.get("posts", { "telegram.telegramId": session.telegramId, helpType: "helpme" });
    const [ihelp] = await mongo_1.client.get("posts", { "telegram.telegramId": session.telegramId, helpType: "ihelp" });
    const user = await getUser(session, res);
    const help_type = req.body.help_type;
    const message = req.body.message;
    const city = req.body.city;
    const status = req.body.status;
    const title = req.body.title;
    if ((helpme != null && help_type == "helpme") || (ihelp != null && help_type == "ihelp"))
        res.send({
            success: false,
            reason: "too-many-ads"
        });
    const post = new Post(user, help_type, title, message, city, status);
    await mongo_1.client.add("posts", post);
    res.send({
        success: true
    });
}
exports.create = create;
async function update(req, res) {
    const session = login_1.sessions[req.session.token];
    const user = await getUser(session, res);
    const help_type = req.body.help_type;
    const message = req.body.message;
    const city = req.body.city;
    const id = new mongodb_1.ObjectId(req.body.id);
    const status = req.body.status;
    const title = req.body.title;
    let [post] = await mongo_1.client.get("posts", { _id: id, "telegram.telegramId": user.telegramId });
    if (post == null)
        return res.send({
            success: false,
            reason: "post-not-found"
        });
    post = new Post(user, help_type, title, message, city, status, post._id);
    await mongo_1.client.update("posts", post._id, post);
    res.send({
        success: true
    });
}
exports.update = update;
async function remove(req, res) {
    const session = login_1.sessions[req.session.token];
    const user = await getUser(session, res);
    const id = new mongodb_1.ObjectId(req.body.id);
    let [post] = await mongo_1.client.get("posts", { _id: id, "telegram.telegramId": user.telegramId });
    if (post == null)
        return res.send({
            success: false,
            reason: "post-not-found"
        });
    await mongo_1.client.remove("posts", post._id);
    res.send({
        success: true
    });
}
exports.remove = remove;
async function getUser(session, res) {
    let user = session.user;
    if (user == null) {
        res.send({
            success: false,
            reason: "access-denied"
        });
    }
    user = new login_1.User(user);
    return user;
}
exports.getUser = getUser;
async function getHelpMe(req, res) {
    try {
        const page = +req.query.page || 0;
        const city = req.query.city || "";
        const offset = page * 5;
        let posts;
        let all;
        const data = [];
        if (city == "Всі міста") {
            posts = await mongo_1.client.get("posts", { helpType: "helpme", status: "active" }, 5, offset);
            all = await mongo_1.client.get("posts", { helpType: "helpme", status: "active" }, 0);
        }
        else {
            posts = await mongo_1.client.get("posts", { helpType: "helpme", status: "active", "data.city": city }, 5, offset);
            all = await mongo_1.client.get("posts", { helpType: "helpme", status: "active", "data.city": city }, 0);
        }
        for (const i in posts) {
            data.push(posts[i].data);
        }
        res.send({
            success: true,
            posts: data,
            count: Math.ceil(all.length / 5)
        });
    }
    catch (err) {
        res.send({
            success: true,
            reason: err
        });
    }
}
exports.getHelpMe = getHelpMe;
async function getIHelp(req, res) {
    try {
        const page = +req.query.page || 0;
        const city = req.query.city || "";
        const offset = page * 5;
        let posts;
        let all;
        const data = [];
        if (city == "Всі міста") {
            posts = await mongo_1.client.get("posts", { helpType: "ihelp", status: "active" }, 5, offset);
            all = await mongo_1.client.get("posts", { helpType: "ihelp", status: "active" }, 0);
        }
        else {
            posts = await mongo_1.client.get("posts", { helpType: "ihelp", status: "active", "data.city": city }, 5, offset);
            all = await mongo_1.client.get("posts", { helpType: "ihelp", status: "active", "data.city": city }, 0);
        }
        for (const i in posts) {
            data.push(posts[i].data);
        }
        res.send({
            success: true,
            posts: data,
            count: Math.ceil(all.length / 5)
        });
    }
    catch (err) {
        res.send({
            success: true,
            reason: err
        });
    }
}
exports.getIHelp = getIHelp;
async function getMyPosts(req, res) {
    const session = login_1.sessions[req.session.token];
    const [helpme] = await mongo_1.client.get("posts", { "telegram.telegramId": session.telegramId, helpType: "helpme" });
    const [ihelp] = await mongo_1.client.get("posts", { "telegram.telegramId": session.telegramId, helpType: "ihelp" });
    res.send({
        success: true,
        helpme: helpme?.data,
        ihelp: ihelp?.data
    });
}
exports.getMyPosts = getMyPosts;
async function upload(req, res) {
    if (req.file == null)
        return res.send({
            success: false,
            reason: "input-error"
        });
    const oldname = req.file.filename;
    const newname = oldname + "." + req.file.mimetype.split("/")[1]; //req.file.originalname;
    fs.renameSync(__dirname + "/files/" + oldname, __dirname + "/files/" + newname);
    res.send({
        success: true,
        file: {
            url: "/image/" + newname
        }
    });
}
exports.upload = upload;
function image(req, res) {
    const path = req.originalUrl.replace("image/", "");
    res.sendFile(__dirname + "/files/" + path);
}
exports.image = image;
class Post {
    _id; // telegram user id for the initial version; random id for old versions or
    original_id; // represents telegram user id
    version;
    telegram;
    telegramUsername;
    botChatId;
    status;
    deleted;
    helpType;
    data;
    additionalParams; // start params
    created;
    lastUpdated;
    constructor(user, helpType, title, message, city, status, id = null) {
        if (id == null)
            this._id = new mongodb_1.ObjectId();
        else
            this._id = new mongodb_1.ObjectId(id);
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
            title: title,
            picture: user.telegram.picture,
            id: this._id
        };
        this.created = new Date();
        this.lastUpdated = this.created;
    }
}
exports.Post = Post;
