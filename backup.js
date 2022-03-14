"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { ObjectId } from "mongodb";
const child_process_1 = require("child_process");
const fs = require("fs");
const env = JSON.parse(fs.readFileSync(__dirname + "/prod.json", "utf8"));
setInterval(() => {
    const filename = (new Date()).toString().replaceAll("+", ""); //new ObjectId() + "";
    (0, child_process_1.exec)(`mongodump --uri="${env.mongo_url}" --db=${env.mongo_db} --out="backup/${filename}"`);
}, env.backup);
