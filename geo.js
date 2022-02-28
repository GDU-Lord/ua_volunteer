"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cities = void 0;
const mongo_1 = require("./mongo");
async function cities(req, res) {
    const data = await getCities();
    const cities = [];
    for (const city of data) {
        cities.push({
            name: city.public_name.uk,
            type: "CITY",
            id: city.id,
            parent_id: city.parent_id
        });
    }
    res.send(cities);
}
exports.cities = cities;
async function getCities() {
    const res = await mongo_1.client.run(async (db) => {
        return await db.collection("locations").find({ type: "CITY" }).limit(0).sort({ name: 1 }).toArray();
    });
    return res;
}
