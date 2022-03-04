import * as dom from "../scripts/components.js";
import { body, head, setUser, LOGIN_OPTIONS, HELPME, IHELP, LOGOUT, CITIES, HELP_OPTIONS, PAGE_OPTIONS, FIND } from "../main.js";
import * as helpme from "./helpme.js";
import * as ihelp from "./ihelp.js";
import * as page_options from "./page_options.js";

const PHONE_REGEX = /\+380[0-9]{9}/g;

export function create (parent: dom.HTMLComponent) {
    const LOGIN = parent.add(new dom.Div("login")) as dom.HTMLInner;

    const title = LOGIN.add(new dom.Div("title")) as dom.HTMLInner;
    title.innerText = "Вхід";

    const phone_lable = LOGIN.add(new dom.Div("phone-lable", ["lable"])) as dom.Div;
    phone_lable.innerText = "Номер телефону (міжнародний формат)";
    const phone = LOGIN.add(new dom.Input("phone")) as dom.Input;

    const link_title = LOGIN.add(new dom.Div("link-title")) as dom.Div;
    link_title.innerText = "Підтвердьте, що це дійсно ви";
    const link_lable = LOGIN.add(new dom.Div("link-lable")) as dom.Div;
    link_lable.innerText = "Будь ласка, перейдіть за посиланням для верифікації";

    const div = LOGIN.add(new dom.Div("link")) as dom.Div;

    const link = div.add(new dom.A("")) as dom.A;
    link.set("target", "_blank");
    link.innerText = "T.ME";
    link.hide();
    link_lable.hide();
    link_title.hide();

    const submit = LOGIN.add(new dom.Button("submit")) as dom.Button;
    submit.innerText = "Увійти";

    const cancel = LOGIN.add(new dom.Div("cancel")) as dom.Div;
    cancel.innerText = "Скасувати";

    cancel.component.onclick = async () => {

        // LOGIN_OPTIONS.show();
        link.hide();
        link_lable.hide();
        link_title.hide();
        phone.show();
        phone_lable.show();
        submit.show();
        title.show();

        LOGIN.hide();

    };
    
    submit.component.onclick = async () => {

        if(phone.value.search(PHONE_REGEX) == -1)
            return alert("Введіть український номер телефону!");

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

        const {success, code, reason} = await login_res.json() as any;

        if(!success) {
            alert("Error");
            submit.unset("disabled");
            return;
        }

        const href = `https://t.me/volunteeruaVerify_bot?start=id_${code}`;
        link.href = "#";

        link.component.onclick = () => {window.open(href, "Верифікація", "popup")};

        link.show();
        link_lable.show();
        link_title.show();
        phone.hide();
        phone_lable.hide();
        submit.hide();
        submit.unset("disabled");
        title.hide();

        const verify_res = await fetch("/login/verified?code="+code);

        const res = await verify_res.json();

        if(res.success) {
            
            setUser(res.user);

            link.hide();
            link_lable.hide();
            link_title.hide();
            phone.show();
            phone_lable.show();
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
    
            if(page_options.createMode)
                PAGE_OPTIONS.byId("page").component.click();

            helpme.load();
            ihelp.load();
        }

        // console.log(await res.json());
    
    }
    return LOGIN;
}

export async function loginActive () {

    const res = await fetch("/login/active");
    const rs = await res.json() as any;

    return rs;

}