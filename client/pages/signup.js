import * as dom from "../scripts/components.js";
import { setUser, LOGIN_OPTIONS, HELPME, LOGOUT, HELP_OPTIONS, CITIES, PAGE_OPTIONS } from "../main.js";
import * as helpme from "./helpme.js";
import * as ihelp from "./ihelp.js";
const PHONE_REGEX = /^\+380[0-9]{9}$/g;
const EMAIL_REGEX = /^[a-zA-Z0-9.]{0,}@[a-zA-Z0-9.]{0,}$/g;
export function create(parent) {
    const SIGNUP = parent.add(new dom.Div("signup"));
    const title = SIGNUP.add(new dom.Div("title"));
    title.innerText = "Реєстрація";
    const fullanme_label = SIGNUP.add(new dom.Div("fullname-label", ["label"]));
    fullanme_label.innerText = "ПІБ";
    const fullname = SIGNUP.add(new dom.Input("fullname"));
    const phone_label = SIGNUP.add(new dom.Div("phone-label", ["label"]));
    phone_label.innerText = "Номер телефону (міжнародний формат)";
    const phone = SIGNUP.add(new dom.Input("phone"));
    const email_label = SIGNUP.add(new dom.Div("email-label", ["label"]));
    email_label.innerText = "Електронна пошта";
    const email = SIGNUP.add(new dom.Input("email"));
    const facebook_label = SIGNUP.add(new dom.Div("facebook-label", ["label"]));
    facebook_label.innerText = "Facebook (посилання на профіль)";
    const facebook = SIGNUP.add(new dom.Input("facebook"));
    const link_img = SIGNUP.add(new dom.HTMLComponent("object", "link-img"));
    link_img.set("data", "/src/verifycation.svg");
    const link_title = SIGNUP.add(new dom.Div("link-title"));
    link_title.innerText = "Підтвердьте, що це дійсно ви";
    const link_label = SIGNUP.add(new dom.Div("link-label"));
    link_label.innerText = "Будь ласка, перейдіть за посиланням для верифікації";
    const div = SIGNUP.add(new dom.Div("link"));
    const link = div.add(new dom.A(""));
    // link.set("target", "_blank");
    link.innerText = "T.ME";
    link.hide();
    link_img.hide();
    link_label.hide();
    link_title.hide();
    const submit = SIGNUP.add(new dom.Button("submit"));
    submit.innerText = "Зареєструватись";
    const cancel = SIGNUP.add(new dom.Div("cancel"));
    cancel.innerText = "Скасувати";
    cancel.component.onclick = async () => {
        // LOGIN_OPTIONS.show();
        link.hide();
        link_img.hide();
        link_label.hide();
        link_title.hide();
        phone.show();
        email.show();
        facebook.show();
        fullname.show();
        phone_label.show();
        email_label.show();
        facebook_label.show();
        fullanme_label.show();
        title.show();
        submit.show();
        SIGNUP.hide();
    };
    submit.component.onclick = async () => {
        fullname.value = fullname.value.trim();
        if (fullname.value == "")
            return alert("Введіть П.І.Б!");
        if (phone.value.search(PHONE_REGEX) == -1)
            return alert("Введіть номер телефону!");
        if (email.value.search(EMAIL_REGEX) == -1)
            return alert("Введіть свій email!");
        if (facebook.value == "")
            return alert("Дайте посиланн на свій Facebook профіль!");
        submit.set("disabled", "disabled");
        const signup_res = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phone: phone.value,
                socials: [email.value, facebook.value],
                fullName: fullname.value
            })
        });
        let { success, code, reason } = await signup_res.json();
        if (!success) {
            alert("Error");
            submit.unset("disabled");
            return;
        }
        const href = `https://t.me/volunteeruaVerify_bot?start=id_${code}`;
        link.href = "#";
        link.component.onclick = () => { window.open(href, "Верифікація", "popup"); };
        link.show();
        link_img.show();
        link_label.show();
        link_title.show();
        title.hide();
        phone.hide();
        email.hide();
        facebook.hide();
        fullname.hide();
        phone_label.hide();
        email_label.hide();
        facebook_label.hide();
        fullanme_label.hide();
        submit.hide();
        submit.unset("disabled");
        const verify_res = await fetch("/signup/verified?code=" + code);
        const res = await verify_res.json();
        if (res.success) {
            setUser(res.user);
            link.hide();
            link_img.hide();
            link_label.hide();
            link_title.hide();
            phone.show();
            email.show();
            facebook.show();
            fullname.show();
            phone_label.show();
            email_label.show();
            facebook_label.show();
            fullanme_label.show();
            submit.show();
            title.show();
            LOGIN_OPTIONS.hide();
            SIGNUP.hide();
            LOGOUT.show();
            HELPME.show();
            HELP_OPTIONS.show();
            CITIES.show();
            PAGE_OPTIONS.show();
            helpme.load();
            ihelp.load();
        }
        // console.log(await res.json());
    };
    return SIGNUP;
}
