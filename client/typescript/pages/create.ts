import * as dom from "../scripts/components.js";
import { body, head, SIGNUP, LOGIN, HELPME, IHELP, CREATE, CITIES, _CREATE } from "../main.js";
import * as cities from "./cities.js";
import * as post from "../scripts/post.js";

export let curId: string = null;
export let editing = false;

export function create (parent: dom.HTMLComponent) {

    const _CREATE = parent.add(new dom.Div("help-options")) as dom.HTMLInner;

    const help_type = _CREATE.add(new dom.Div("select")) as dom.Div;

    const helpme = help_type.add(new dom.Input("helpme")) as any;
    helpme.value = "helpme";
    helpme.set("type", "radio");
    helpme.set("name", "help_type");

    const helpme_lable = help_type.add(new dom.HTMLInner("lable")) as dom.HTMLInner;
    helpme_lable.innerText = "Мені потрібно";

    const ihelp = help_type.add(new dom.Input("ihelp")) as any;
    ihelp.value = "ihelp";
    ihelp.set("type", "radio");
    ihelp.set("name", "help_type");

    const ihelp_lable = help_type.add(new dom.HTMLInner("lable")) as dom.HTMLInner;
    ihelp_lable.innerText = "Я можу";
    
    helpme.component.onclick = () => {

        update("helpme");
    
    }

    ihelp.component.onclick = () => {

        update("ihelp");

    }

    const message = _CREATE.add(new dom.HTMLValue("textarea", "message")) as dom.HTMLValue;
    message.set("placeholder", "Текст оголошення...");

    const status = _CREATE.add(new dom.Div("status")) as dom.Div;

    const active = status.add(new dom.Input("active")) as any;
    active.value = "active";
    active.set("type", "radio");
    active.set("name", "status");

    active.component.click();

    const active_lable = status.add(new dom.HTMLInner("lable")) as dom.HTMLInner;
    active_lable.innerText = "Активний";

    const paused = status.add(new dom.Input("paused")) as any;
    paused.value = "paused";
    paused.set("type", "radio");
    paused.set("name", "status");

    const paused_lable = status.add(new dom.HTMLInner("lable")) as dom.HTMLInner;
    paused_lable.innerText = "Призупенено";

    const resolved = status.add(new dom.Input("resolved")) as any;
    resolved.value = "resolved";
    resolved.set("type", "radio");
    resolved.set("name", "status");

    const resolved_lable = status.add(new dom.HTMLInner("lable")) as dom.HTMLInner;
    resolved_lable.innerText = "Виконано";

    const submit = _CREATE.add(new dom.Button("submit")) as dom.Button;
    submit.innerText = "Зберегти";

    const edit = _CREATE.add(new dom.Button("edit")) as dom.Button;
    edit.innerText = "Змінити";

    const remove = _CREATE.add(new dom.Button("remove")) as dom.Button;
    remove.innerText = "Видалити";

    edit.hide();
    remove.hide();

    edit.component.onclick = function () {

        if(editing) {

            if(helpme.component.checked)
                update("helpme");
            if(ihelp.component.checked)
                update("ihelp");
            edit.innerText = "Редагувати";
            
            editing = false;

            return;
        }

        editing = true;

        submit.unset("disabled");
        message.unset("disabled");
        active.unset("disabled");
        paused.unset("disabled");
        resolved.unset("disabled");
        edit.innerText = "Скасувати";

    };

    submit.component.onclick = async function () {

        const city = CITIES.component.querySelector(".city") as HTMLInputElement;

        if(!(city.value in cities.cityList))
            return alert("Вкажіть місто!");

        let helpType: string;
        if(ihelp.component.checked)
            helpType = "ihelp";
        else if(helpme.component.checked)
            helpType = "helpme";
        else
            return alert("Вкажіть тип оголошення!");
        
        if(message.value.length < 20)
            return alert("Оголошення закоротке!");

        let status: string;
        if(active.component.checked)
            status = "active";
        else if(paused.component.checked)
            status = "paused";
        else if(resolved.component.checked)
            status = "resolved";
        else
            return alert("Вкажіть статус оголошення!");
        
        submit.set("disabled", "disabled");

        let res;

        if(curId == null) {
            res = await fetch("/post/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    city: city.value,
                    help_type: helpType,
                    message: message.value,
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
                    city: city.value,
                    help_type: helpType,
                    message: message.value,
                    status: status,
                    id: curId
                })
            });
        }

        const {success} = await res.json();

        submit.unset("disabled");

        if(!success)
            return;

        message.value = "";
        
        update(helpType);

    }

    // helpme.component.click();

    return _CREATE;

}

export async function update (help_type) {

    const [helpme, ihelp] = await post.getMyPosts();

    const remove = _CREATE.byId("remove") as dom.Button;
    const edit = _CREATE.byId("edit") as dom.Button;
    const message = _CREATE.byId("message") as dom.HTMLValue;
    message.value = "";
    message.unset("disabled");

    const status =_CREATE.byId("status") as dom.HTMLInner;

    const active = status.byId("active") as dom.HTMLValue;
    const paused = status.byId("paused") as dom.HTMLValue;
    const resolved = status.byId("resolved") as dom.HTMLValue;
    
    active.unset("disabled");
    paused.unset("disabled");
    resolved.unset("disabled");

    remove.hide();
    edit.hide();

    let ad;

    curId = null;

    if(help_type == "helpme")
        ad = helpme;
    else if(help_type == "ihelp")
        ad = ihelp;
    else
        return;

    if(ad == null)
        return;
    
    message.value = ad.message;
    message.set("disabled", "disabled");
    active.set("disabled", "disabled");
    paused.set("disabled", "disabled");
    resolved.set("disabled", "disabled");

    const city = CITIES.component.querySelector(".city") as HTMLInputElement;
    city.value = ad.city;

    cities.set(ad.city);

    curId = ad.id;

    const submit = _CREATE.byId("submit") as dom.Button;
    submit.set("disabled", "disabled");
    remove.show();
    edit.show();


}