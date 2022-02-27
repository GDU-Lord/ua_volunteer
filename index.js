"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const app = express();
const server = (0, http_1.createServer)(app);
server.listen(80, "localhost", () => {
    console.log("Сервер працює!");
});
app.get("/", (req, res) => {
    res.send("<h1>Слава Україні!</h1>");
});
