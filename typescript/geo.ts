import * as express from "express";
import {client} from "./mongo";

export async function cities (req: express.Request, res: express.Response) {

    const data = await getCities();
    const cities = [];

    for(const city of data) {
        cities.push({
            name: city.public_name.uk,
            type: "CITY",
            id: city.id,
            parent_id: city.parent_id
        });
    }

    res.send(JSON.stringify({
        success: true,
        data: cities
    }));

}

async function getCities () {

    const res = await client.run(async (db) => {

        return await db.collection("locations").find({ type: "CITY" }).limit(0).sort({ name: 1 }).toArray();

    });

    return res;

}