import * as dom from "../scripts/components.js";
import * as helpme from "./helpme.js";
import * as ihelp from "./ihelp.js";
export let curCity = "Всі міста";
export let cityList = {};
export let opened = false;
export let enabled = true;
let list, input, field, pin;
export function setStatus(en) {
    enabled = en;
    if (enabled)
        return;
    helpme.reset();
    ihelp.reset();
    helpme.load();
    ihelp.load();
    list.hide();
    input.hide();
    field.show();
    opened = false;
}
export function set(city) {
    curCity = city;
    const i = document.querySelector("#create").querySelector(".city");
    const f = document.querySelector("#create").querySelector("#city-button");
    i.value = curCity;
    f.innerText = curCity;
}
export function create(parent) {
    const CITIES = parent.add(new dom.HTMLInner("form", "cities"));
    CITIES.set("autofill", "false");
    pin = CITIES.add(new dom.HTMLComponent("object", "pin"));
    pin.set("data", "/src/pin.svg");
    input = CITIES.add(new dom.Input("", ["city"]));
    input.set("autocomplete", "false");
    input.set("placeholder", "Почніть друкувати...");
    field = CITIES.add(new dom.Div("city-button"));
    field.innerText = "Всі міста";
    list = CITIES.add(new dom.Div("city-list"));
    input.hide();
    list.hide();
    fetch("/cities").then(res => res.json()).then(({ success, data }) => {
        if (!success)
            return;
        cityList = {};
        function onclick() {
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
        for (const city of data) {
            const line = new dom.Div("", ["line"]);
            list.add(line);
            line.innerText = city.name;
            line.component.onclick = onclick;
            cityList[city.name] = city;
        }
    });
    // list.hide();
    field.component.onclick = () => {
        if (!enabled)
            return;
        if (opened) {
            list.hide();
            opened = false;
            return;
        }
        // list.show();
        list.show();
        field.hide();
        input.show();
        input.value = field.innerText;
        if (input.value == "Всі міста")
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
        for (const line of list.children) {
            if (line.innerText.search(value) > -1)
                line.show();
            else
                line.hide();
        }
        list.show();
    };
    return CITIES;
}
