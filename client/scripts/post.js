import { Alert } from "./alert.js";
import * as dom from "./components.js";
export let my_helpme = null;
export let my_ihelp = null;
export class Post {
    div;
    title;
    message;
    date;
    city;
    phone;
    facebook;
    email;
    fullname;
    contact;
    picture;
    constructor(post, parent) {
        this.div = parent.add(new dom.Div("", ["post"]));
        this.title = this.div.add(new dom.Div("", ["title"]));
        this.message = this.div.add(new dom.Div("", ["message"]));
        this.city = this.div.add(new dom.HTMLInner("label", "", ["city"]));
        this.date = this.div.add(new dom.HTMLInner("label", "", ["date"]));
        this.phone = this.div.add(new dom.Div("", ["phone"]));
        this.facebook = this.div.add(new dom.Div("", ["facebook"]));
        this.email = this.div.add(new dom.Div("", ["mail"]));
        this.fullname = this.div.add(new dom.Div("", ["fullname"]));
        this.contact = this.div.add(new dom.Button("", ["contact"]));
        this.picture = this.div.add(new dom.Div("", ["picture"]));
        this.contact.innerText = "Зв'язатись";
        this.title.innerText = post.title;
        this.message.innerText = post.message;
        this.city.innerHTML = `<object class="city-pin" data="src/pin outline.svg"></object><label>${post.city}</label>`;
        this.date.innerText = getDate(post.date);
        // this.email.innerHTML = `<object src="${post.socials[0]}"></object>`;
        // this.facebook.innerHTML = `<object src="${post.socials[1]}"></object>`;
        // this.phone.innerHTML = `<object src="${post.phone}"></object>`;
        // this.email.innerHTML = `<object class="ico-mail" data="/src/mail.svg"></object>`;
        // this.facebook.innerHTML = `<object class="ico-facebook" data="/src/facebook.svg"></object>`;
        // this.phone.innerHTML = `<object class="ico-phone" data="/src/phone.svg"></object>`;
        this.phone.component.onclick = () => {
            window.open("tel:" + post.phone, "popup", "Зателефонувати");
            Alert(post.phone);
        };
        this.facebook.component.onclick = () => {
            window.open(post.socials[1], "_blank", "Facebook");
            // console.log();
        };
        this.email.component.onclick = () => {
            window.open("mailto:" + post.socials[0], "_blank", "Facebook");
        };
        this.contact.component.onclick = () => {
            Alert(`Контактні дані:<br><br><a target="_blank" href="${post.socials[1]}">Facebook</a><br><br><a href="mailto:${post.socials[0]}">${post.socials[0]}</a><br><br><a href="tel:${post.phone}">${post.phone}</a>`);
        };
        const name = post.fullName?.split(" ")[1] || "";
        const surname = post.fullName?.split(" ")[0] || post.fullName?.split(" ")[2] || "";
        this.fullname.innerText = name + " " + (surname[0] || "") + ".";
        if (this.fullname.innerText == " .")
            this.fullname.innerText = "Користувач";
        let src = post.picture;
        if (src == null)
            src = "/src/profile.png";
        this.picture.innerHTML = `<img src="${src}">`;
    }
}
export function createPost() {
    fetch("/post/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            help_type: "helpme",
            message: "test",
            city: "м. Київ",
            photos: [] // the list of photos (relitive links)
        })
    }).then(res => res.text().then(res => console.log("CREATE", res)));
}
export async function getMyPosts() {
    const res = await fetch("/post/me");
    const { success, helpme, ihelp } = await res.json();
    if (!success)
        return [null, null];
    my_helpme = helpme;
    my_ihelp = ihelp;
    return [helpme, ihelp];
}
function getDate(str) {
    // 2022-03-06T07:38:03.184+00:00
    return str.slice(0, 10).split("-").reverse().join(".");
}
