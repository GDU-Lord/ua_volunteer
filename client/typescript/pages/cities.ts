import * as dom from "../scripts/components.js";
import { body, head, SIGNUP, LOGIN, HELPME, IHELP, helpme_container } from "../main.js";
import * as helpme from "./helpme.js";
import * as ihelp from "./ihelp.js";

export let curCity = "Всі міста";
export let cityList: Object = {};
export let opened: boolean = false;

export function set (city) {

    curCity = city;
    helpme.reset();
    ihelp.reset();
    helpme.load();
    ihelp.load();

}

export function create (parent: dom.HTMLComponent) {

    const CITIES = parent.add(new dom.HTMLInner("form", "cities")) as dom.HTMLInner;
    CITIES.set("autofill", "false");

    const pin = CITIES.add(new dom.HTMLComponent("object", "pin")) as dom.HTMLComponent;
    pin.set("data", "/src/pin.svg");
    const input = CITIES.add(new dom.Input("", ["city"])) as dom.Input;
    input.set("autocomplete", "false");
    input.set("placeholder", "Почніть друкувати...");
    const field = CITIES.add(new dom.Div("city-button")) as dom.Div;
    field.innerText = "Всі міста";
    const list = CITIES.add(new dom.Div("city-list")) as dom.Div;

    input.hide();
    list.hide();

    fetch("/cities").then(res => res.json()).then(({ success, data }) => {

        if(!success)
            return;

        cityList = {};

        function onclick () {
            field.innerText = curCity = this.innerText;
            helpme.reset();
            ihelp.reset();
            helpme.load();
            ihelp.load();
            list.hide();
            input.hide();
            field.show();
            opened = false;
        }

        const line = new dom.Div("", ["line"]);
        list.add(line);
        line.innerText = "Всі міста";
        line.component.onclick = onclick;

        for(const city of data) {
            
            const line = new dom.Div("", ["line"]);
            list.add(line);
            line.innerText = city.name;
            line.component.onclick = onclick;

            cityList[city.name] = city;

        }

    });

    // list.hide();

    field.component.onclick = () => {

        if(opened) {

            list.hide();

            opened = false;
            return;
        }

        // list.show();
        list.show();
        field.hide();
        input.show();
        input.value = "";
        input.component.focus();

        opened = true;

    };

    // input.component.onfocus = () => {

    //     list.show();

    // };

    // CITIES.component.onblur = () => {

    //     list.hide();

    // };

    input.component.oninput = input.component.onfocus = function (e) {

        const value = input.value;

        // console.log(1234);

        for(const line of list.children as dom.HTMLInner[]) {
            
            if(line.innerText.search(value) > -1)
                line.show();
            else
                line.hide();
        }

        list.show();

    };

    return CITIES;

}