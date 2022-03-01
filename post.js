"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.image = exports.upload = exports.getPosts = exports.getUser = exports.update = exports.create = void 0;
const mongodb_1 = require("mongodb");
const login_1 = require("./login");
const mongo_1 = require("./mongo");
const fs = require("fs");
async function create(req, res) {
    const session = login_1.sessions[req.session.token];
    const user = await getUser(session, res);
    const help_type = req.body.help_type;
    const message = req.body.message;
    const city = req.body.city;
    const post = new Post(user, help_type, message, city);
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
    let [post] = await mongo_1.client.get("posts", { _id: id });
    if (post == null)
        return res.send({
            success: false,
            reason: "post-not-found"
        });
    post = new Post(user, help_type, message, city, post._id);
    await mongo_1.client.update("posts", post._id, post);
    res.send({
        success: true
    });
}
exports.update = update;
async function getUser(session, res) {
    let [user] = await mongo_1.client.get("users", { telegramId: session.telegramId });
    user = new login_1.User(user);
    if (user == null) {
        res.send({
            success: false,
            reason: "access-denied"
        });
    }
    return user;
}
exports.getUser = getUser;
async function getPosts(req, res) {
    try {
        const posts = await mongo_1.client.get("posts", {}, 0);
        res.send({
            success: true,
            posts: posts
        });
    }
    catch (err) {
        res.send({
            success: true,
            reason: err
        });
    }
}
exports.getPosts = getPosts;
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
    constructor(user, helpType, message, city, id = null) {
        if (id == null)
            this._id = new mongodb_1.ObjectId();
        else
            this._id = new mongodb_1.ObjectId(id);
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
exports.Post = Post;
