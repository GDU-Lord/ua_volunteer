import { MongoClient, Db, ObjectId } from "mongodb";

const uri = "mongodb+srv://volunteerua_dev_site:lQ5Xub5186IKvHXV@cluster0.9na5w.mongodb.net";
const dbname = "volunteerua";

export default class Data {

    client: MongoClient;
    name: string;

    constructor (name: string = "default") {

        this.client = new MongoClient(uri);
        this.name = name;

    }

    // run a mongodb command
    async run (callback: (db: Db) => void = () => {}) {

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
    async get (coll: string, filter: Object, limit: number = 1) {

        const res = await this.run(async (db) => {

            return await db.collection(coll).find(filter).limit(limit).toArray();

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

