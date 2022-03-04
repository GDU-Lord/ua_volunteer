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
    res.send(JSON.stringify({
        success: true,
        data: cities
    }));
}
exports.cities = cities;
const abc = "абвгґдеєжзиіїйклмнопрстуфхцчшщюяь .";
const ABC = {};
for (const i in abc) {
    ABC[abc[i]] = +i;
}
function compare(str1, str2) {
    const a = ABC[str1[0]] || null;
    const b = ABC[str2[0]] || null;
    if (a > b)
        return 1;
    if (a < b)
        return -1;
    if (str1.length == 1)
        return 1;
    if (str2.length == 1)
        return -1;
    let _str1 = "";
    for (const i in str1) {
        if (i != "0")
            _str1 += str1[i];
    }
    let _str2 = "";
    for (const i in str2) {
        if (i != "0")
            _str2 += str2[i];
    }
    return compare(_str1, _str2);
}
async function getCities() {
    const res = await mongo_1.client.run(async (db) => {
        const rs = (await db.collection("locations").find({ type: "CITY" }).limit(0).toArray()).sort((a, b) => {
            let A = a.public_name.uk.toLowerCase();
            let B = b.public_name.uk.toLowerCase();
            return compare(A, B);
        });
        return rs;
    });
    return res;
}
