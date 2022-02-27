"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCode = exports.random = exports.isVerified = exports.signup = exports.pending_users = void 0;
const telegram = require("./telegram");
const mongodb_1 = require("mongodb");
exports.pending_users = {};
function signup(req, res) {
    const user = req.body;
    user.id = new mongodb_1.ObjectId();
    user.code = getCode();
    exports.pending_users[user.code] = user;
    console.log(user);
    res.send(user);
}
exports.signup = signup;
async function isVerified(req, res) {
    const code = req.query.code;
    const user = exports.pending_users[code];
    if (user == null)
        return res.send(false);
    const v = await telegram.verify(user);
    if (v)
        delete exports.pending_users[code];
    res.send(v);
}
exports.isVerified = isVerified;
function random() {
    return Math.floor(Math.random() * 10).toString();
}
exports.random = random;
function getCode() {
    const code = random() + random() + random() + random();
    if (code in exports.pending_users)
        return getCode();
    return code;
}
exports.getCode = getCode;
