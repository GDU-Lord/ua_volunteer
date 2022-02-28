"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.User = exports.verify = exports.logout = exports.isVerifiedLogin = exports.isVerifiedSignup = exports.login = exports.signup = exports.sessions = exports.pending_users = void 0;
const telegram = require("./telegram");
const mongodb_1 = require("mongodb");
const mongo_1 = require("./mongo");
exports.pending_users = {};
exports.sessions = {};
async function signup(req, res) {
    const user = req.body;
    user._id = new mongodb_1.ObjectId();
    user.code = new mongodb_1.ObjectId();
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
    const phone = req.body.phone;
    let [user] = await mongo_1.client.get("users", { phone: phone });
    user = new User(user);
    if (user == null)
        return res.send({
            success: false,
            reason: "phone-not-found"
        });
    user.code = new mongodb_1.ObjectId();
    exports.pending_users[String(user.code)] = user;
    res.send({
        success: true,
        code: user.code
    });
}
exports.login = login;
async function isVerifiedSignup(req, res) {
    const code = req.query.code;
    const user = exports.pending_users[code];
    if (user == null)
        return res.send({
            success: false,
            reason: "insufficient-code"
        });
    user.telegram = await telegram.verify(user.code);
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
    const code = req.query.code;
    const user = exports.pending_users[code];
    if (user == null)
        return res.send({
            success: false,
            reason: "insufficient-code"
        });
    user.telegram = await telegram.verify(user.code);
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
    next(req, res);
}
exports.verify = verify;
class User {
    fullName;
    phone;
    socials;
    telegram;
    telegramId;
    constructor(user) {
        this.fullName = user.fullName || "";
        this.phone = user.phone || "";
        this.socials = user.socials || [];
        this.telegram = user.telegram || null;
        this.telegramId = user.telegramId || null;
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
    constructor(user) {
        this._id = new mongodb_1.ObjectId();
        this.telegramId = user.telegramId;
        this.created = new Date();
        this.terminated = false;
        exports.sessions[String(this._id)] = this;
    }
    terminate() {
        this.terminated = true;
        delete exports.sessions[String(this._id)];
    }
}
exports.Session = Session;
