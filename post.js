"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.create = void 0;
const mongodb_1 = require("mongodb");
const login_1 = require("./login");
const mongo_1 = require("./mongo");
async function create(req, res) {
    const session = login_1.sessions[req.session.token];
    if (session == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });
    const telegramId = session.telegramId;
    let [user] = await mongo_1.client.get("users", { telegramId: telegramId });
    user = new login_1.User(user);
    if (user == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });
    const help_type = req.body.help_type;
    const message = req.body.help.message;
    // new Post(user, );
}
exports.create = create;
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
    constructor(user, helpType, message, city) {
        this._id = new mongodb_1.ObjectId();
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
exports.Post = Post;
