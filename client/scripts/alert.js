import * as dom from "./components.js";
import { body } from "../main.js";
let bg, box, text, ok, cancel;
let promise = null;
export async function Alert(msg) {
    text.innerHTML = msg;
    bg.show();
    box.show();
    ok.show();
    cancel.hide();
    return new Promise((res, rej) => {
        promise = res;
    });
}
export async function Confirm(msg) {
    text.innerHTML = msg;
    bg.show();
    box.show();
    ok.show();
    cancel.show();
    return new Promise((res, rej) => {
        promise = res;
    });
}
export function init() {
    bg = body.add(new dom.Div("alert-bg"));
    box = body.add(new dom.Div("alert-box"));
    text = box.add(new dom.Div("text"));
    ok = box.add(new dom.Button("ok", ["button"]));
    ok.innerText = "Ок";
    cancel = box.add(new dom.Button("cancel", ["button"]));
    cancel.innerText = "Скасувати";
    bg.hide();
    box.hide();
    ok.component.onclick = () => {
        if (promise != null)
            promise(true);
        box.hide();
        bg.hide();
    };
    cancel.component.onclick = () => {
        if (promise != null)
            promise(false);
        box.hide();
        bg.hide();
    };
}
