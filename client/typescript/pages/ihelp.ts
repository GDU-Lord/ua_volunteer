import * as dom from "../scripts/components.js";
import { body, head, ihelp_container, FIND, IHELP  } from "../main.js";
import * as post from "../scripts/post.js";
import { curCity } from "./cities.js";

let page = 0;
let length = 0;
let offset = 0;
let buts: dom.Button[] = [];
let busy = false;

export function reset () {
    page = 0;
    length = 0;
    offset = 0;
}

export function create (parent: dom.HTMLComponent) {

    const IHELP = parent.add(new dom.Div("ihelp")) as dom.Div;
    const container = IHELP.add(new dom.Div("container")) as dom.Div;
    const buttons = IHELP.add(new dom.Div("buttons")) as dom.Div;

    const left = buttons.add(new dom.Button("left", ["button"])) as dom.Button;
    left.innerText = "<";
    
    buts = [];

    function lock () {
        for(const but of buts)
            but.set("disabled", "disabled");
    }   

    left.component.onclick = function () {

        page --;
        offset --;

        if(page < 0)
            page = 0;
        else if(page > length-1)
            page = length-1;

        load();
        lock();

    };

    buts.push(left);
    
    for(let i = 0; i < 6; i ++) {

        const button = new dom.Button("button-"+i, ["button"]);
        button.index = i;

        button.hide();

        button.component.onclick = function () {
            page = +button.innerText-1;
            if(page < 0)
                page = 0;
            if(page > length-1)
                page = length-1;

            load();
            lock();
            
        };

        buttons.add(button);

        buts.push(button);

    }

    const right = buttons.add(new dom.Button("right", ["button"])) as dom.Button;
    right.innerText = ">";

    right.component.onclick = function () {

        page ++;
        offset ++;

        if(page < 0)
            page = 0;
        else if(page > length-1)
            page = length-1;

        load();
        lock();

    };

    buts.push(right);

    left.hide();
    right.hide();

    return [IHELP, container];

}

export async function load () {

    if(busy)
        return;

    busy = true;

    ihelp_container.children = [];
    ihelp_container.innerHTML = "";

    const res = await fetch("/ihelp?page="+page+"&city="+curCity);

    const {success, posts, count} = await res.json() as any;

    const buttons = IHELP.byId("buttons") as dom.Div;
    const right = buttons.byId("right") as dom.Button;
    const left = buttons.byId("left") as dom.Button;

    for(let i = 0; i < 6; i ++ ) {

        const button = buttons.byId("button-"+i) as dom.Button;

        button.innerText = String(i+offset+1);

        if(button.innerText == String(page+1))
            button.addClass("select");
        else
            button.remClass("select");

        if(+button.innerText <= count)
            button.show();
        else
            button.hide();

        if(count <= 6 || (i == 5 && button.innerText == count))
            right.hide();
        else
            right.show();

        if(offset > 0)
            left.show();
        else
            left.hide();
        
    }

    if(success) {
        length = count;
        for(const ad of posts)
            new post.Post(ad, ihelp_container);
    }

    for(const but of buts)
        but.unset("disabled");

    busy = false;

}