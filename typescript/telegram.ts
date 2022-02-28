import { TELEGRAM } from "./types";
import * as express from "express";
import { ObjectId } from "mongodb";

const listeners = [];

export function verify (code: ObjectId) {

    return new Promise<TELEGRAM>((res, rej) => {

        const index = listeners.length;

        listeners[index] = (data: TELEGRAM, _code: string, response: express.Response) => {
            
            if(_code == String(code)) {
                    
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

export function receive (req: express.Request, res: express.Response) {

    const token = req.body.token as string;
    const code = req.body.code as string;
    const data = req.body.data as TELEGRAM;
    const success = req.body.success as boolean;
    const reason = req.body.reason as string;

    if(!success)
        return res.send({
            success: false,
            reason: "bot-error"
        });

    for(const i in listeners)
        if(listeners[i](data, code, res))
            return;
    
    res.send({
        success: false,
        reason: "user-not-found"
    });

}