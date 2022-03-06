import * as dom from "../scripts/components.js";
import { HELPME, helpme_container } from "../main.js";
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
    const HELPME = parent.add(new dom.Div("helpme"));
    const container = HELPME.add(new dom.Div("container"));
    const buttons = HELPME.add(new dom.Div("buttons"));
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
        buts.push(button);
        buttons.add(button);
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
    // left.component.onclick = function () {
    //     if(page == 0)
    //         return;
    //     page --;
    //     page_num.innerText = String(page+1);
    //     load();
    // };
    // right.component.onclick = function () {
    //     if(page >= length-1) {
    //         page = length-1;
    //         page_num.innerText = String(page+1);
    //         load();
    //         return;
    //     }
    //     page ++;
    //     page_num.innerText = String(page+1);
    //     load();
    // };
    const not_found = HELPME.add(new dom.Div("not-found"));
    not_found.innerText = "Упс...\nНа жаль, нічого не знайдено.";
    not_found.hide();
    return [HELPME, container];
}
export async function load() {
    if (busy)
        return;
    const not_found = HELPME.byId("not-found");
    busy = true;
    helpme_container.children = [];
    helpme_container.innerHTML = "";
    const res = await fetch("/helpme?page=" + page + "&city=" + curCity);
    const { success, posts, count } = await res.json();
    const buttons = HELPME.byId("buttons");
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
            new post.Post(ad, helpme_container);
    }
    for (const but of buts)
        but.unset("disabled");
    if (count == 0)
        not_found.show();
    else
        not_found.hide();
    busy = false;
}
