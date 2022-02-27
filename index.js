"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const login = require("./login");
const app = express();
const server = (0, http_1.createServer)(app);
server.listen(80, "localhost", () => {
    console.log("Сервер працює!");
});
app.use("/", express.static("client"));
app.post("/signup", express.json(), login.signup);
app.get("/isVerified", login.isVerified);
