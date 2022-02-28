"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.verify = void 0;
const listeners = [];
function verify(code) {
    return new Promise((res, rej) => {
        const index = listeners.length;
        listeners[index] = (data, _code) => {
            if (_code == String(code)) {
                delete listeners[index];
                res(data);
                return true;
            }
            return false;
        };
    });
}
exports.verify = verify;
function check(code, data, success, reason) {
    if (!success)
        return false;
    for (const i in listeners) {
        const res = listeners[i](data, code);
        if (res)
            return true;
    }
    return false;
}
exports.check = check;
// export function receive (req: express.Request, res: express.Response) {
//     const token = req.body.token as string;
//     const code = req.body.code as string;
//     const data = req.body.data as TELEGRAM;
//     const success = req.body.success as boolean;
//     const reason = req.body.reason as string;
//     if(!success)
//         return res.send({
//             success: false,
//             reason: "bot-error"
//         });
//     for(const i in listeners)
//         if(listeners[i](data, code, res))
//             return;
//     res.send({
//         success: false,
//         reason: "user-not-found"
//     });
// }
