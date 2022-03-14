// import { ObjectId } from "mongodb";
import { exec } from "child_process";
import * as fs from "fs";

const env = JSON.parse(fs.readFileSync(__dirname + "/prod.json", "utf8"));

setInterval(() => {

    const filename = (new Date()).toString().replaceAll("+", "");//new ObjectId() + "";

    exec(`mongodump --uri="${env.mongo_url}" --db=${env.mongo_db} --out="backup/${filename}"`);

}, env.backup);