"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const login = require("./login");
const telegram = require("./telegram");
const app = express();
const server = (0, http_1.createServer)(app);
server.listen(80, "localhost", () => {
    console.log("Сервер працює!");
});
app.use("/", express.static("client"));
app.post("/signup", express.json(), login.signup);
app.post("/botAccept", express.json(), telegram.receive);
app.get("/isVerifiedSignup", login.isVerifiedSignup);
app.post("/login", express.json(), login.login);
app.get("/isVerifiedLogin", login.isVerifiedLogin);
