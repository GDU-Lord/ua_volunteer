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
    constructor(post, parent) {
        this.div = parent.add(new dom.Div("", ["post"]));
        this.title = this.div.add(new dom.Div("", ["title"]));
        this.message = this.div.add(new dom.Div("", ["message"]));
        this.city = this.div.add(new dom.HTMLInner("label", "", ["city"]));
        this.date = this.div.add(new dom.HTMLInner("label", "", ["date"]));
        this.phone = this.div.add(new dom.Div("", ["phone"]));
        this.facebook = this.div.add(new dom.Div("", ["facebook"]));
        this.email = this.div.add(new dom.Div("", ["email"]));
        this.fullname = this.div.add(new dom.Div("", ["fullname"]));
        this.contact = this.div.add(new dom.Button("", ["contact"]));
        this.contact.innerText = "Зв'язатись";
        this.title.innerText = "Оголошення";
        this.message.innerText = post.message;
        this.city.innerHTML = `<object class="city-pin" data="src/pin outline.svg"></object><label>${post.city}</label>`;
        this.date.innerText = post.date;
        // this.email.innerHTML = `<object src="${post.socials[0]}"></object>`;
        // this.facebook.innerHTML = `<object src="${post.socials[1]}"></object>`;
        // this.phone.innerHTML = `<object src="${post.phone}"></object>`;
        this.email.innerHTML = `<object class="mail" data="src/mail.svg"></object>`;
        this.facebook.innerHTML = `<object class="facebook" data="src/facebook.svg"></object>`;
        this.phone.innerHTML = `<object class="phone" data="src/phone.svg"></object>`;
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
