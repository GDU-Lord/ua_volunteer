import * as dom from "../scripts/components.js";
import { botname, setUser, LOGIN_OPTIONS, HELPME, LOGOUT, CITIES, HELP_OPTIONS, PAGE_OPTIONS, FIND, guide } from "../main.js";
import * as helpme from "./helpme.js";
import * as ihelp from "./ihelp.js";
import * as page_options from "./page_options.js";
import { Alert } from "../scripts/alert.js";
import error from "../scripts/error.js";
const PHONE_REGEX = /\+380[0-9]{9}/g;
export function create(parent) {
    const LOGIN = parent.add(new dom.Div("login"));
    const title = LOGIN.add(new dom.Div("title"));
    title.innerText = "Вхід";
    const phone_label = LOGIN.add(new dom.Div("phone-label", ["label"]));
    phone_label.innerText = "Номер телефону (міжнародний формат)";
    const phone = LOGIN.add(new dom.Input("phone"));
    const link_img = LOGIN.add(new dom.HTMLComponent("object", "link-img"));
    link_img.set("data", "/src/verifycation.svg");
    const link_title = LOGIN.add(new dom.Div("link-title"));
    link_title.innerText = "Підтвердьте, що це дійсно ви";
    const link_label = LOGIN.add(new dom.Div("link-label"));
    link_label.innerText = "Будь ласка, перейдіть за посиланням для верифікації";
    const div = LOGIN.add(new dom.Div("link"));
    const link = div.add(new dom.A(""));
    // link.set("target", "_blank");
    link.innerText = "T.ME";
    link.hide();
    link_img.hide();
    link_label.hide();
    link_title.hide();
    const submit = LOGIN.add(new dom.Button("submit"));
    submit.innerText = "Увійти";
    const cancel = LOGIN.add(new dom.Div("cancel"));
    cancel.innerText = "Скасувати";
    cancel.component.onclick = async () => {
        // LOGIN_OPTIONS.show();
        link.hide();
        link_img.hide();
        link_label.hide();
        link_title.hide();
        phone.show();
        phone_label.show();
        submit.show();
        title.show();
        guide.show();
        LOGIN.hide();
    };
    submit.component.onclick = async () => {
        if (phone.value.search(PHONE_REGEX) == -1)
            return await Alert("Введіть український номер телефону!");
        submit.set("disabled", "disabled");
        const login_res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phone: phone.value
            })
        });
        const { success, code, reason } = await login_res.json();
        if (!success) {
            await Alert(error(reason));
            submit.unset("disabled");
            return;
        }
        link.unset("href");
        const href = `https://t.me/${botname}?start=id_${code}`;
        link.component.onclick = () => { window.open(href, "Верифікація", "popup"); };
        link.show();
        link_img.show();
        link_label.show();
        link_title.show();
        phone.hide();
        phone_label.hide();
        submit.hide();
        submit.unset("disabled");
        title.hide();
        const verify_res = await fetch("/login/verified?code=" + code);
        const res = await verify_res.json();
        if (res.success) {
            setUser(res.user);
            link.hide();
            link_img.hide();
            link_label.hide();
            link_title.hide();
            phone.show();
            phone_label.show();
            submit.show();
            title.show();
            LOGIN.hide();
            LOGIN_OPTIONS.hide();
            LOGOUT.show();
            HELPME.show();
            HELP_OPTIONS.show();
            CITIES.show();
            PAGE_OPTIONS.show();
            FIND.show();
            if (page_options.createMode)
                PAGE_OPTIONS.byId("page").component.click();
            helpme.load();
            ihelp.load();
        }
        else {
            await Alert(error(res.reason));
        }
        // console.log(await res.json());
    };
    return LOGIN;
}
export async function loginActive() {
    const res = await fetch("/login/active");
    const rs = await res.json();
    return rs;
}
