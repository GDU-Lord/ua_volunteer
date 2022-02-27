import { TELEGRAM } from "./types";
import * as express from "express";
import { ObjectId } from "mongodb";

const listeners = [];

export function verify (code: ObjectId) {

    return new Promise<TELEGRAM>((res, rej) => {

        const index = listeners.length;

        listeners[index] = (data: TELEGRAM, _code: string, response: express.Response) => {
            
            if(_code == String(code)) {

                if(!data)
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

export function receive (req: express.Request, res: express.Response) {

    const token = req.body.token;
    const code = req.body.code;
    const data = req.body.data as TELEGRAM;

    for(const i in listeners)
        listeners[i](data, code, res)

}