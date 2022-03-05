import * as dom from "./components.js";

export let my_helpme: Object = null; 
export let my_ihelp: Object = null;

export class Post {

    div: dom.Div;
    title: dom.Div;
    message: dom.Div;
    date: dom.Div;
    city: dom.Div;
    phone: dom.Div;
    facebook: dom.Div;
    email: dom.Div;
    fullname: dom.Div;
    contact: dom.Button;

    constructor (post, parent: dom.HTMLComponent) {

        this.div = parent.add(new dom.Div("", ["post"])) as dom.Div;

        this.title = this.div.add(new dom.Div("", ["title"])) as dom.Div;
        this.message = this.div.add(new dom.Div("", ["message"])) as dom.Div;
        this.city = this.div.add(new dom.HTMLInner("label", "", ["city"])) as dom.Div;
        this.date = this.div.add(new dom.HTMLInner("label", "", ["date"])) as dom.Div;
        this.phone = this.div.add(new dom.Div("", ["phone"])) as dom.Div;
        this.facebook = this.div.add(new dom.Div("", ["facebook"])) as dom.Div;
        this.email = this.div.add(new dom.Div("", ["email"])) as dom.Div;
        this.fullname = this.div.add(new dom.Div("", ["fullname"])) as dom.Div;
        this.contact = this.div.add(new dom.Button("", ["contact"])) as dom.Button;
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

export function createPost () {

    fetch("/post/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            help_type: "helpme", // category
            message: "test", // ad message
            city: "м. Київ", // the city's public name
            photos: [] // the list of photos (relitive links)
        })
    }).then(res => res.text().then(res => console.log("CREATE", res)));

}

export async function getMyPosts () {

    const res = await fetch("/post/me");

    const {success, helpme, ihelp} = await res.json();

    if(!success)
        return [null, null];

    my_helpme = helpme;
    my_ihelp = ihelp;

    return [helpme, ihelp];

}