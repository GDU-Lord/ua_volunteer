"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const login = require("./login");
const telegram = require("./telegram");
const geo = require("./geo");
const post = require("./post");
const cookieSession = require("cookie-session");
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
app.get("/isverifiedsignup", login.isVerifiedSignup);
app.post("/login", express.json(), login.login);
app.get("/isverifiedlogin", login.isVerifiedLogin);
app.post("/botaccept", express.json(), telegram.receive);
app.get("/cities", login.verify, geo.cities);
app.post("/post", login.verify, post.create);
