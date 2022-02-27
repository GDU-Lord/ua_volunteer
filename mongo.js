"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const mongodb_1 = require("mongodb");
const uri = "mongodb+srv://volunteerua_dev_site:lQ5Xub5186IKvHXV@cluster0.9na5w.mongodb.net";
const dbname = "volunteerua";
class Data {
    client;
    name;
    constructor(name = "default") {
        this.client = new mongodb_1.MongoClient(uri);
        this.name = name;
    }
    // run a mongodb command
    async run(callback = () => { }) {
        let res;
        try {
            await this.client.connect();
            const db = await this.client.db(dbname);
            res = await callback(db);
        }
        catch (err) {
            await this.client.close();
            return "error";
        }
        finally {
            await this.client.close();
            return res;
        }
    }
    // get documents by a certain parameter
    async get(coll, filter, limit = 1) {
        const res = await this.run(async (db) => {
            return await db.collection(coll).find(filter).limit(limit).toArray();
        });
        return res;
    }
    // insert documents into a collection
    async add(coll, ...content) {
        const res = await this.run(async (db) => {
            return await db.collection(coll).insertMany(content);
        });
        return res;
    }
    // update document in a collection
    async update(coll, id, content) {
        const res = await this.run(async (db) => {
            return await db.collection(coll).updateOne({ _id: id }, { $set: content });
        });
        return res;
    }
    // remove document from a collection
    async remove(coll, id) {
        const res = await this.run(async (db) => {
            return await db.collection(coll).deleteOne({ _id: id });
        });
        return res;
    }
}
exports.default = Data;
exports.client = new Data();
