"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receive = exports.verify = void 0;
const listeners = [];
function verify(code) {
    return new Promise((res, rej) => {
        const index = listeners.length;
        listeners[index] = (data, _code, response) => {
            if (_code == String(code)) {
                delete listeners[index];
                response.send({
                    success: true
                });
                res(data);
                return true;
            }
            return false;
        };
    });
}
exports.verify = verify;
function receive(req, res) {
    const token = req.body.token;
    const code = req.body.code;
    const data = req.body.data;
    const success = req.body.success;
    const reason = req.body.reason;
    if (!success)
        return res.send({
            success: false,
            reason: "bot-error"
        });
    for (const i in listeners)
        if (listeners[i](data, code, res))
            return;
    res.send({
        success: false,
        reason: "user-not-found"
    });
}
exports.receive = receive;
