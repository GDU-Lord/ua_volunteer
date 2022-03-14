import { MongoClient, Db, ObjectId } from "mongodb";
import { env } from "./index";

const uri = env.mongo_url;
const dbname = env.mongo_db;

export default class Data {

    client: MongoClient;
    name: string;
    db: Db

    constructor (name: string = "default") {

        this.client = new MongoClient(uri);
        this.name = name;
        this.db = null;

    }

    // run a mongodb command
    async run (callback: (db: Db) => void = () => {}) {

        let res = null;

        try {

            if(this.db == null) {
                await this.client.connect();
                this.db = await this.client.db(dbname);
            }

            res = await callback(this.db);

        }
        catch (err) {

            console.log(err);
            return "error";
            
        }
        finally {

            return res;

        }

    }

    // get documents by a certain parameter
    async get (coll: string, filter: Object, limit: number = 1, offset: number = 0) {

        const res = await this.run(async (db) => {

            return await db.collection(coll).find(filter).sort({created: -1}).skip(offset).limit(limit).toArray();

        });

        return res;

    }

    // insert documents into a collection
    async add (coll: string, ...content: any[]) {

        const res = await this.run(async (db) => {

            return await db.collection(coll).insertMany(content);

        });

        return res;

    }

    // update document in a collection
    async update (coll: string, id: ObjectId, content: any) {

        const res = await this.run(async (db) => {

            return await db.collection(coll).updateOne({ _id: id }, { $set: content });

        });

        return res;

    }

    // remove document from a collection
    async remove (coll: string, id: ObjectId) {

        const res = await this.run(async (db) => {

            return await db.collection(coll).deleteOne({ _id: id });

        });

        return res;

    }
}

export const client = new Data();

