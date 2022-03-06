import * as dom from "../scripts/components.js";
import { ihelp_container, IHELP } from "../main.js";
import * as post from "../scripts/post.js";
import { curCity } from "./cities.js";
let page = 0;
let length = 0;
let offset = 0;
let buts = [];
let busy = false;
export function reset() {
    page = 0;
    length = 0;
    offset = 0;
}
export function create(parent) {
    const IHELP = parent.add(new dom.Div("ihelp"));
    const container = IHELP.add(new dom.Div("container"));
    const buttons = IHELP.add(new dom.Div("buttons"));
    const left = buttons.add(new dom.Button("left", ["button"]));
    left.innerText = "<";
    buts = [];
    function lock() {
        for (const but of buts)
            but.set("disabled", "disabled");
    }
    left.component.onclick = function () {
        page--;
        offset--;
        if (page < 0)
            page = 0;
        else if (page > length - 1)
            page = length - 1;
        load();
        lock();
    };
    buts.push(left);
    for (let i = 0; i < 6; i++) {
        const button = new dom.Button("button-" + i, ["button"]);
        button.index = i;
        button.hide();
        button.component.onclick = function () {
            page = +button.innerText - 1;
            if (page < 0)
                page = 0;
            if (page > length - 1)
                page = length - 1;
            load();
            lock();
        };
        buttons.add(button);
        buts.push(button);
    }
    const right = buttons.add(new dom.Button("right", ["button"]));
    right.innerText = ">";
    right.component.onclick = function () {
        page++;
        offset++;
        if (page < 0)
            page = 0;
        else if (page > length - 1)
            page = length - 1;
        load();
        lock();
    };
    buts.push(right);
    left.hide();
    right.hide();
    const not_found = IHELP.add(new dom.Div("not-found"));
    not_found.innerText = "Упс...\nНа жаль, нічого не знайдено.";
    not_found.hide();
    return [IHELP, container];
}
export async function load() {
    if (busy)
        return;
    const not_found = IHELP.byId("not-found");
    busy = true;
    ihelp_container.children = [];
    ihelp_container.innerHTML = "";
    const res = await fetch("/ihelp?page=" + page + "&city=" + curCity);
    const { success, posts, count } = await res.json();
    const buttons = IHELP.byId("buttons");
    const right = buttons.byId("right");
    const left = buttons.byId("left");
    for (let i = 0; i < 6; i++) {
        const button = buttons.byId("button-" + i);
        button.innerText = String(i + offset + 1);
        if (button.innerText == String(page + 1))
            button.addClass("select");
        else
            button.remClass("select");
        if (+button.innerText <= count)
            button.show();
        else
            button.hide();
        if (count <= 6 || (i == 5 && button.innerText == count))
            right.hide();
        else
            right.show();
        if (offset > 0)
            left.show();
        else
            left.hide();
    }
    if (success) {
        length = count;
        for (const ad of posts)
            new post.Post(ad, ihelp_container);
    }
    for (const but of buts)
        but.unset("disabled");
    if (count == 0)
        not_found.show();
    else
        not_found.hide();
    busy = false;
}
