import * as dom from "../scripts/components.js";
import { ihelp_container } from "../main.js";
import * as post from "../scripts/post.js";
import { curCity } from "./cities.js";
let page = 0;
let length = 0;
export function reset() {
    page = 0;
    length = 0;
}
export function create(parent) {
    const IHELP = parent.add(new dom.Div("ihelp"));
    const container = IHELP.add(new dom.Div("container"));
    const buttons = IHELP.add(new dom.Div("buttons"));
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
    return [IHELP, container];
}
export async function load() {
    ihelp_container.children = [];
    ihelp_container.innerHTML = "";
    const res = await fetch("/ihelp?page=" + page + "&city=" + curCity);
    const { success, posts, count } = await res.json();
    if (success) {
        length = count;
        for (const ad of posts)
            new post.Post(ad, ihelp_container);
    }
}
