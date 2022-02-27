"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receive = exports.verify = void 0;
const listeners = [];
function verify(code) {
    return new Promise((res, rej) => {
        const index = listeners.length;
        listeners[index] = (data, _code, response) => {
            if (_code == String(code)) {
                if (!data)
                    return response.send({
                        success: false
                    });
                delete listeners[index];
                response.send({
                    success: true
                });
                res(data);
            }
        };
    });
}
exports.verify = verify;
function receive(req, res) {
    const token = req.body.token;
    const code = req.body.code;
    const data = req.body.data;
    for (const i in listeners)
        listeners[i](data, code, res);
}
exports.receive = receive;
