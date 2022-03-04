import * as dom from "../scripts/components.js";
import { helpme_container } from "../main.js";
import * as post from "../scripts/post.js";
import { curCity } from "./cities.js";
let page = 0;
let length = 0;
export function reset() {
    page = 0;
    length = 0;
}
export function create(parent) {
    const HELPME = parent.add(new dom.Div("helpme"));
    const container = HELPME.add(new dom.Div("container"));
    const buttons = HELPME.add(new dom.Div("buttons"));
    const left = buttons.add(new dom.Button("left"));
    const page_num = buttons.add(new dom.Div("page-number"));
    const right = buttons.add(new dom.Button("right"));
    left.innerText = "<";
    right.innerText = ">";
    page_num.innerText = "1";
    left.component.onclick = function () {
        if (page == 0)
            return;
        page--;
        page_num.innerText = String(page + 1);
        load();
    };
    right.component.onclick = function () {
        if (page >= length - 1) {
            page = length - 1;
            page_num.innerText = String(page + 1);
            load();
            return;
        }
        page++;
        page_num.innerText = String(page + 1);
        load();
    };
    return [HELPME, container];
}
export async function load() {
    helpme_container.children = [];
    helpme_container.innerHTML = "";
    console.log(curCity, "load");
    const res = await fetch("/helpme?page=" + page + "&city=" + curCity);
    const { success, posts, count } = await res.json();
    if (success) {
        length = count;
        for (const ad of posts)
            new post.Post(ad, helpme_container);
    }
}
