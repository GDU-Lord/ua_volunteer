"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVerifiedLogin = exports.isVerifiedSignup = exports.login = exports.signup = exports.pending_users = void 0;
const telegram = require("./telegram");
const mongodb_1 = require("mongodb");
const mongo_1 = require("./mongo");
exports.pending_users = {};
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
    const [user] = await mongo_1.client.get("users", { phone: phone });
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
        user.telegramId = user.telegram.id;
        const [u] = await mongo_1.client.get("users", {
            telegramId: user.telegramId
        });
        if (u != null)
            return res.send({
                success: false,
                reason: "telegram-exists"
            });
        await mongo_1.client.add("users", user);
        // start session here
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
        user.telegramId = user.telegram.id;
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
        // start session here
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
