import * as dom from "../scripts/components.js";
import { CITIES, _CREATE } from "../main.js";
import * as cities from "./cities.js";
import * as post from "../scripts/post.js";
export let curId = null;
export let editing = false;
export function create(parent) {
    const _CREATE = parent.add(new dom.Div("help-options"));
    const help_type = _CREATE.add(new dom.Div("select"));
    const helpme = help_type.add(new dom.Input("helpme"));
    helpme.value = "helpme";
    helpme.set("type", "radio");
    helpme.set("name", "help_type");
    const helpme_lable = help_type.add(new dom.HTMLInner("lable"));
    helpme_lable.innerText = "Мені потрібно";
    const ihelp = help_type.add(new dom.Input("ihelp"));
    ihelp.value = "ihelp";
    ihelp.set("type", "radio");
    ihelp.set("name", "help_type");
    const ihelp_lable = help_type.add(new dom.HTMLInner("lable"));
    ihelp_lable.innerText = "Я можу";
    helpme.component.onclick = () => {
        update("helpme");
    };
    ihelp.component.onclick = () => {
        update("ihelp");
    };
    const message = _CREATE.add(new dom.HTMLValue("textarea", "message"));
    message.set("placeholder", "Текст оголошення...");
    const status = _CREATE.add(new dom.Div("status"));
    const active = status.add(new dom.Input("active"));
    active.value = "active";
    active.set("type", "radio");
    active.set("name", "status");
    active.component.click();
    const active_lable = status.add(new dom.HTMLInner("lable"));
    active_lable.innerText = "Активний";
    const paused = status.add(new dom.Input("paused"));
    paused.value = "paused";
    paused.set("type", "radio");
    paused.set("name", "status");
    const paused_lable = status.add(new dom.HTMLInner("lable"));
    paused_lable.innerText = "Призупенено";
    const resolved = status.add(new dom.Input("resolved"));
    resolved.value = "resolved";
    resolved.set("type", "radio");
    resolved.set("name", "status");
    const resolved_lable = status.add(new dom.HTMLInner("lable"));
    resolved_lable.innerText = "Виконано";
    const submit = _CREATE.add(new dom.Button("submit"));
    submit.innerText = "Зберегти";
    const edit = _CREATE.add(new dom.Button("edit"));
    edit.innerText = "Змінити";
    const remove = _CREATE.add(new dom.Button("remove"));
    remove.innerText = "Видалити";
    edit.hide();
    remove.hide();
    edit.component.onclick = function () {
        if (editing) {
            if (helpme.component.checked)
                update("helpme");
            if (ihelp.component.checked)
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
        const city = CITIES.component.querySelector(".city");
        if (!(city.value in cities.cityList))
            return alert("Вкажіть місто!");
        let helpType;
        if (ihelp.component.checked)
            helpType = "ihelp";
        else if (helpme.component.checked)
            helpType = "helpme";
        else
            return alert("Вкажіть тип оголошення!");
        if (message.value.length < 20)
            return alert("Оголошення закоротке!");
        let status;
        if (active.component.checked)
            status = "active";
        else if (paused.component.checked)
            status = "paused";
        else if (resolved.component.checked)
            status = "resolved";
        else
            return alert("Вкажіть статус оголошення!");
        submit.set("disabled", "disabled");
        let res;
        if (curId == null) {
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
        const { success } = await res.json();
        submit.unset("disabled");
        if (!success)
            return;
        message.value = "";
        update(helpType);
    };
    // helpme.component.click();
    return _CREATE;
}
export async function update(help_type) {
    const [helpme, ihelp] = await post.getMyPosts();
    const remove = _CREATE.byId("remove");
    const edit = _CREATE.byId("edit");
    const message = _CREATE.byId("message");
    message.value = "";
    message.unset("disabled");
    const status = _CREATE.byId("status");
    const active = status.byId("active");
    const paused = status.byId("paused");
    const resolved = status.byId("resolved");
    active.unset("disabled");
    paused.unset("disabled");
    resolved.unset("disabled");
    remove.hide();
    edit.hide();
    let ad;
    curId = null;
    if (help_type == "helpme")
        ad = helpme;
    else if (help_type == "ihelp")
        ad = ihelp;
    else
        return;
    if (ad == null)
        return;
    message.value = ad.message;
    message.set("disabled", "disabled");
    active.set("disabled", "disabled");
    paused.set("disabled", "disabled");
    resolved.set("disabled", "disabled");
    const city = CITIES.component.querySelector(".city");
    city.value = ad.city;
    cities.set(ad.city);
    curId = ad.id;
    const submit = _CREATE.byId("submit");
    submit.set("disabled", "disabled");
    remove.show();
    edit.show();
}
