import * as dom from "./components.js";
import { body } from "../main.js";

let bg, box, text, ok, cancel;
    
let promise: any = null;

export async function Alert (msg: string) {

    text.innerHTML = msg;
    bg.show();
    box.show();
    ok.show();
    cancel.hide();

    return new Promise((res, rej) => {

        promise = res;

    });

}

export async function Confirm (msg: string) {

    text.innerHTML = msg;
    bg.show();
    box.show();
    ok.show();
    cancel.show();
    
    return new Promise((res, rej) => {

        promise = res;

    });

}

export function init () {

    bg = body.add(new dom.Div("alert-bg")) as dom.Div;
    box = body.add(new dom.Div("alert-box")) as dom.Div;
    text = box.add(new dom.Div("text")) as dom.Div;
    ok = box.add(new dom.Button("ok", ["button"])) as dom.Button;
    ok.innerText = "Ок";
    cancel = box.add(new dom.Button("cancel", ["button"])) as dom.Button;
    cancel.innerText = "Скасувати";
    
    bg.hide();
    box.hide();
    
    ok.component.onclick = () => {
    
        if(promise != null)
            promise(true);
    
        box.hide();
        bg.hide();
    
    };
    
    cancel.component.onclick = () => {
    
        if(promise != null)
            promise(false);
    
        box.hide();
        bg.hide();
    
    };
    
}
