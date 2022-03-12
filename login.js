"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.User = exports.remove = exports.ban = exports.verifyAdmin = exports.isAdmin = exports.getUser = exports.verify = exports.logout = exports.isVerifiedLogin = exports.isVerifiedSignup = exports.login = exports.signup = exports.sessions = exports.pending_users = void 0;
const mongodb_1 = require("mongodb");
const mongo_1 = require("./mongo");
const telegramWebhook = require("./telegram-weebhook");
const index_1 = require("./index");
exports.pending_users = {};
exports.sessions = {};
async function signup(req, res) {
    if (exports.sessions[req.session.token] != null)
        return res.send({
            success: false,
            reason: "logged-in"
        });
    let user = req.body;
    user._id = new mongodb_1.ObjectId();
    user.code = new mongodb_1.ObjectId();
    let [banned] = await mongo_1.client.get("blacklist", { phone: user.phone });
    if (banned != null)
        return res.send({
            success: false,
            reason: "banned"
        });
    user = new User(user);
    const [u] = await mongo_1.client.get("users", { phone: user.phone });
    if (u != null)
        return res.send({
            success: false,
            reason: "phone-exists"
        });
    exports.pending_users[String(user.code)] = user;
    res.send({
        success: true,
        code: user.code
    });
}
exports.signup = signup;
async function login(req, res) {
    if (exports.sessions[req.session.token] != null)
        return res.send({
            success: false,
            reason: "logged-in"
        });
    const phone = req.body.phone;
    let [banned] = await mongo_1.client.get("blacklist", { phone: phone });
    if (banned != null)
        return res.send({
            success: false,
            reason: "banned"
        });
    let [user] = await mongo_1.client.get("users", { phone: phone });
    if (user == null)
        return res.send({
            success: false,
            reason: "phone-not-found"
        });
    user = new User(user);
    user.code = new mongodb_1.ObjectId();
    exports.pending_users[String(user.code)] = user;
    res.send({
        success: true,
        code: user.code
    });
}
exports.login = login;
async function isVerifiedSignup(req, res) {
    if (exports.sessions[req.session.token] != null)
        return res.send({
            success: false,
            reason: "logged-in"
        });
    const code = req.query.code;
    const user = exports.pending_users[code];
    if (user == null)
        return res.send({
            success: false,
            reason: "insufficient-code"
        });
    user.telegram = await telegramWebhook.verify(user);
    delete exports.pending_users[code];
    if (user.telegram) {
        user.telegramId = user.telegram.telegramId;
        const [u] = await mongo_1.client.get("users", {
            telegramId: user.telegramId
        });
        if (u != null)
            return res.send({
                success: false,
                reason: "telegram-exists"
            });
        await mongo_1.client.add("users", user);
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
exports.isVerifiedSignup = isVerifiedSignup;
async function isVerifiedLogin(req, res) {
    if (exports.sessions[req.session.token] != null)
        return res.send({
            success: false,
            reason: "logged-in"
        });
    const code = req.query.code;
    const user = exports.pending_users[code];
    if (user == null)
        return res.send({
            success: false,
            reason: "insufficient-code"
        });
    user.telegram = await telegramWebhook.verify(user, false);
    delete exports.pending_users[code];
    if (user.telegram) {
        user.telegramId = user.telegram.telegramId;
        const [u] = await mongo_1.client.get("users", {
            telegramId: user.telegramId
        });
        if (u == null)
            return res.send({
                success: false,
                reason: "telegram-not-found"
            });
        if (u.telegramId != user.telegramId)
            return res.send({
                success: false,
                reason: "wrong-telegram"
            });
        let session = Session.find(user.telegramId);
        if (session != null)
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
exports.isVerifiedLogin = isVerifiedLogin;
async function logout(req, res) {
    if (req.session.token != null) {
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
exports.logout = logout;
function verify(req, res, next) {
    const token = req.session.token;
    const session = exports.sessions[token];
    if (session == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });
    next();
}
exports.verify = verify;
async function getUser(req, res, next) {
    const token = req.session.token;
    const session = exports.sessions[token];
    let user = session.user;
    if (user == null)
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
exports.getUser = getUser;
async function isAdmin(req, res) {
    const token = req.session.token;
    const session = exports.sessions[token];
    let user = session.user;
    if (user == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });
    user = new User(user);
    if (user.admin === index_1.env.admin)
        return res.send({
            success: true
        });
    return res.send({
        success: false,
        reason: "access-denied"
    });
}
exports.isAdmin = isAdmin;
async function verifyAdmin(req, res, next) {
    const token = req.session.token;
    const session = exports.sessions[token];
    let user = session.user;
    if (user == null)
        return res.send({
            success: false,
            reason: "access-denied"
        });
    user = new User(user);
    if (user.admin === index_1.env.admin)
        next();
    else
        return res.send({
            success: false,
            reason: "access-denied"
        });
}
exports.verifyAdmin = verifyAdmin;
async function ban(req, res) {
    let id = new mongodb_1.ObjectId(req.body.id);
    let [post] = await mongo_1.client.get("posts", { _id: id });
    if (post == null)
        return res.send({
            success: false,
            reason: "not-found"
        });
    const telegramId = post.telegram.telegramId;
    let [user] = await mongo_1.client.get("users", { telegramId: telegramId });
    if (user == null)
        return res.send({
            success: false,
            reason: "not-found"
        });
    user = new User(user);
    await mongo_1.client.add("blacklist", user);
    const posts = await mongo_1.client.get("posts", { "telegram.telegramId": user.telegramId });
    for (const post of posts) {
        await mongo_1.client.add("archive", post);
        await mongo_1.client.remove("posts", post._id);
    }
    for (const i in exports.sessions) {
        const session = exports.sessions[i];
        if (session.telegramId == telegramId)
            session.terminate();
    }
    res.send({
        success: true
    });
}
exports.ban = ban;
async function remove(req, res) {
    let id = new mongodb_1.ObjectId(req.body.id);
    let [post] = await mongo_1.client.get("posts", { _id: id });
    if (post == null)
        return res.send({
            success: false,
            reason: "not-found"
        });
    await mongo_1.client.remove("posts", id);
    res.send({
        success: true
    });
}
exports.remove = remove;
class User {
    fullName;
    phone;
    socials;
    telegram;
    telegramId;
    admin;
    constructor(user) {
        this.fullName = user?.fullName || "";
        this.phone = user?.phone || "";
        this.socials = user?.socials || [];
        this.telegram = user?.telegram || null;
        this.telegramId = user?.telegramId || null;
        this.admin = user?.admin || "";
    }
}
exports.User = User;
class Session {
    static find(telegramId) {
        for (const i in exports.sessions) {
            if (exports.sessions[i].telegramId == telegramId)
                return exports.sessions[i];
        }
        return null;
    }
    telegramId;
    _id;
    created;
    terminated;
    user;
    constructor(user) {
        this._id = new mongodb_1.ObjectId();
        this.telegramId = user?.telegramId;
        this.created = new Date();
        this.terminated = false;
        this.user = user;
        exports.sessions[String(this._id)] = this;
    }
    terminate() {
        this.terminated = true;
        delete exports.sessions[String(this._id)];
    }
}
exports.Session = Session;
