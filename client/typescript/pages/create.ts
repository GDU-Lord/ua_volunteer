import * as dom from "../scripts/components.js";
import { body, head, SIGNUP, LOGIN, HELPME, IHELP, CREATE, CITIES, _CREATE } from "../main.js";
import * as cities2 from "./cities2.js";
import * as post from "../scripts/post.js";
import * as helpme from "./helpme.js";
import * as ihelp from "./ihelp.js";
import { Alert, Confirm } from "../scripts/alert.js";

export let curId: string = null;
export let editing = false;
export let unsaved = false;

async function check () {

    if(unsaved == true) {
        if(await Confirm("Ви впевнені, що хочете покинути сторінку? Незбережені зміни буде втрачено!")) {
            unsaved = false;
            return true;
        }
        return false;
    }

    return true;

}

export function makeUnsaved () {

    unsaved = true;

}

export function create (parent: dom.HTMLComponent) {

    const _CREATE = parent.add(new dom.Div("create-container")) as dom.Div;

    const heading = _CREATE.add(new dom.Div("heading")) as dom.Div;
    heading.innerText = "Мої оголошення";

    const top = _CREATE.add(new dom.Div("top")) as dom.Div;
    const bottom = _CREATE.add(new dom.Div("bottom")) as dom.Div;

    const help_type = top.add(new dom.Div("select")) as dom.Div;

    const helpme = help_type.add(new dom.Input("helpme")) as any;
    helpme.value = "helpme";
    helpme.set("type", "radio");
    helpme.set("name", "help_type");

    const helpme_label = help_type.add(new dom.HTMLInner("div", "", ["label"])) as dom.HTMLInner;
    helpme_label.innerText = "Я потребую допомоги";

    const ihelp = help_type.add(new dom.Input("ihelp")) as any;
    ihelp.value = "ihelp";
    ihelp.set("type", "radio");
    ihelp.set("name", "help_type");

    const ihelp_label = help_type.add(new dom.HTMLInner("div", "", ["label"])) as dom.HTMLInner;
    ihelp_label.innerText = "Я готовий допомогти";
    
    helpme.component.onclick = async (e) => {

        if(!await check())
            return ihelp.component.checked = true;
        update("helpme");
    
    }

    ihelp.component.onclick = async (e) => {
        
        if(!await check())
            return helpme.component.checked = true;
        update("ihelp");

    }

    const title_label = top.add(new dom.Div("title-label", ["label"])) as dom.Div;
    title_label.innerText = "Назва";

    const title = top.add(new dom.Input("title")) as dom.Input;

    const message_label = bottom.add(new dom.Div("message-label", ["label"])) as dom.Div;
    message_label.innerText = "Опис";

    const message = bottom.add(new dom.HTMLValue("textarea", "message")) as dom.HTMLValue;
    // message.set("placeholder", "Текст оголошення...");

    const text = bottom.add(new dom.Div("text")) as dom.Div;
    text.innerHTML = "Аби запобігти спаму, діють певні обмеження.<br>Ви можете мати лише одне оголошення з кожної категорії.<br><br>Щоб додати нове оголошення,<br>змініть категорію або видаліть<br>попереднє оголошення.";
    text.hide();

    const status = bottom.add(new dom.Div("status")) as dom.Div;

    const active = status.add(new dom.Input("active", ["check"])) as any;
    active.value = "active";
    active.set("type", "radio");
    active.set("name", "status");

    active.component.click();
    unsaved = false;

    const active_label = status.add(new dom.HTMLInner("div", "", ["label"])) as dom.HTMLInner;
    active_label.innerText = "Активний";

    const paused = status.add(new dom.Input("paused", ["check"])) as any;
    paused.value = "paused";
    paused.set("type", "radio");
    paused.set("name", "status");

    const paused_label = status.add(new dom.HTMLInner("div", "", ["label"])) as dom.HTMLInner;
    paused_label.innerText = "Призупенено";

    const resolved = status.add(new dom.Input("resolved", ["check"])) as any;
    resolved.value = "resolved";
    resolved.set("type", "radio");
    resolved.set("name", "status");

    const resolved_label = status.add(new dom.HTMLInner("div", "", ["label"])) as dom.HTMLInner;
    resolved_label.innerText = "Виконано";

    const submit_buttons = _CREATE.add(new dom.Div("submit-buttons")) as dom.Div;

    const submit = submit_buttons.add(new dom.Button("submit", ["button"])) as dom.Button;
    submit.innerText = "Зберегти";

    const edit = submit_buttons.add(new dom.Button("edit", ["button"])) as dom.Button;
    edit.innerText = "Змінити";

    const remove = submit_buttons.add(new dom.Button("remove", ["button"])) as dom.Button;
    remove.innerText = "Видалити";

    edit.hide();
    remove.hide();

    message.component.oninput = title.component.oninput = () => {

        unsaved = true;

    };

    active.component.onclick = paused.component.onclick = resolved.component.onclick = () => {
        
        unsaved = true;

    };

    remove.component.onclick = async function () {

        if(!await Confirm("Ви дійсно впевнені, що хочете видалити оголошення?"))
            return;

        const res = await fetch("/post/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: curId
            })
        });

        const {success} = await res.json();

        if(!success)
            return Alert("Помилка!");

        if(helpme.component.checked)
            update("helpme");
        if(ihelp.component.checked)
            update("ihelp");

    }

    edit.component.onclick = async function () {

        if(editing) {

            if(!await check())
                return;

            if(helpme.component.checked)
                update("helpme");
            if(ihelp.component.checked)
                update("ihelp");
            edit.innerText = "Редагувати";
            
            editing = false;
            cities2.setStatus(false);

            return;
        }

        editing = true;

        submit.unset("disabled");
        message.unset("disabled");
        title.unset("disabled");
        active.unset("disabled");
        paused.unset("disabled");
        resolved.unset("disabled");
        edit.innerText = "Скасувати";
        unsaved = true;
        cities2.setStatus(true);

    };

    submit.component.onclick = async function () {

        if(cities2.curCity == "Всі міста")
            return await Alert("Вкажіть місто!");

        if(title.value == "")
            return await Alert("Введіть назву оголошення!");

        let helpType: string;
        if(ihelp.component.checked)
            helpType = "ihelp";
        else if(helpme.component.checked)
            helpType = "helpme";
        else
            return await Alert("Вкажіть тип оголошення!");
        
        if(message.value.length < 20)
            return await Alert("Оголошення закоротке!");

        let status: string;
        if(active.component.checked)
            status = "active";
        else if(paused.component.checked)
            status = "paused";
        else if(resolved.component.checked)
            status = "resolved";
        else
            return await Alert("Вкажіть статус оголошення!");
        
        submit.set("disabled", "disabled");

        let res;

        if(curId == null) {
            res = await fetch("/post/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    city: cities2.curCity,
                    help_type: helpType,
                    title: title.value.slice(0,255),
                    message: message.value.slice(0,999),
                    status: status
                })
            });
        }
        else {
            res = await fetch("/post/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    city: cities2.curCity,
                    help_type: helpType,
                    title: title.value.slice(0,255),
                    message: message.value.slice(0,999),
                    status: status,
                    id: curId
                })
            });
        }

        const {success} = await res.json();

        submit.unset("disabled");

        if(!success)
            return;

        unsaved = false;
        editing = false;
        edit.innerText = "Редагувати";
        
        update(helpType);

    }

    helpme.component.click();

    return _CREATE;

}

export async function update (help_type) {

    const [_helpme, _ihelp] = await post.getMyPosts();

    const top = _CREATE.byId("top") as dom.Div;
    const bottom = _CREATE.byId("bottom") as dom.Div;
    const submit_buttons = _CREATE.byId("submit-buttons") as dom.HTMLInner;

    const remove = submit_buttons.byId("remove") as dom.Button;
    const edit = submit_buttons.byId("edit") as dom.Button;
    const submit = submit_buttons.byId("submit") as dom.Button;
    const title = top.byId("title") as dom.HTMLValue;
    title.value = "";
    title.unset("disabled");
    const message = bottom.byId("message") as dom.HTMLValue;
    message.value = "";
    message.unset("disabled");
    submit.unset("disabled");

    const status = bottom.byId("status") as dom.HTMLInner;

    const active = status.byId("active") as dom.HTMLValue;
    const paused = status.byId("paused") as dom.HTMLValue;
    const resolved = status.byId("resolved") as dom.HTMLValue;

    const text = bottom.byId("text");
    text.hide();
    
    active.unset("disabled");
    paused.unset("disabled");
    resolved.unset("disabled");

    active.component.click();
    unsaved = false;

    cities2.setStatus(true);

    remove.hide();
    edit.hide();

    helpme.load();
    ihelp.load();

    let ad;

    curId = null;

    cities2.set("Всі міста");

    if(help_type == "helpme")
        ad = _helpme;
    else if(help_type == "ihelp")
        ad = _ihelp;
    else
        return;

    if(ad == null)
        return;

    if(ad.status == "active")
        active.component.click();
    if(ad.status == "paused")
        paused.component.click();
    if(ad.status == "resolved")
        resolved.component.click();

    unsaved = false;
    editing = false;
    edit.innerText = "Редагувати";
    
    title.value = ad.title;
    message.value = ad.message;
    title.set("disabled", "disabled");
    message.set("disabled", "disabled");
    active.set("disabled", "disabled");
    paused.set("disabled", "disabled");
    resolved.set("disabled", "disabled");

    const city = CITIES.component.querySelector(".city") as HTMLInputElement;
    city.value = ad.city;

    cities2.set(ad.city);
    cities2.setStatus(false);

    curId = ad.id;

    submit.set("disabled", "disabled");
    remove.show();
    edit.show();
    text.show();

}