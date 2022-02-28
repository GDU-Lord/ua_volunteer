"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const login = require("./login");
const geo = require("./geo");
const post = require("./post");
const telegramWebhook = require("./telegram-weebhook");
const cookieSession = require("cookie-session");
const telegram_weebhook_1 = require("./telegram-weebhook");
const app = express();
const server = (0, http_1.createServer)(app);
server.listen(80, "localhost", () => {
    console.log("Сервер працює!");
});
app.use(cookieSession({
    name: "session",
    keys: ["rudolf steiner"]
}));
app.use("/", express.static("client"));
app.post("/signup", express.json(), login.signup);
app.get("/signup/verified", login.isVerifiedSignup);
app.post("/login", express.json(), login.login);
app.get("/login/verified", login.isVerifiedLogin);
app.post("/logout", express.json(), login.logout);
app.get("/cities", login.verify, geo.cities);
app.post("/post/create", express.json(), login.verify, post.create);
// webhook
app.post(`/telegram/update/${telegram_weebhook_1.BOT_API_TOKEN.replace(/:/g, "_")}`, express.json(), telegramWebhook.receive);
