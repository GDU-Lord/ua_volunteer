import { Alert } from "./alert.js";
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
    picture: dom.Div;

    constructor (post, parent: dom.HTMLComponent) {

        this.div = parent.add(new dom.Div("", ["post"])) as dom.Div;

        this.title = this.div.add(new dom.Div("", ["title"])) as dom.Div;
        this.fullname = this.div.add(new dom.Div("", ["fullname"])) as dom.Div;
        this.message = this.div.add(new dom.Div("", ["message"])) as dom.Div;
        this.city = this.div.add(new dom.HTMLInner("label", "", ["city"])) as dom.Div;
        this.date = this.div.add(new dom.HTMLInner("label", "", ["date"])) as dom.Div;
        this.phone = this.div.add(new dom.Div("", ["phone"])) as dom.Div;
        this.facebook = this.div.add(new dom.Div("", ["facebook"])) as dom.Div;
        this.email = this.div.add(new dom.Div("", ["mail"])) as dom.Div;
        this.contact = this.div.add(new dom.Button("", ["contact"])) as dom.Button;
        this.picture = this.div.add(new dom.Div("", ["picture"])) as dom.Div;

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

            window.open("tel:"+post.phone, "popup", "Зателефонувати");
            Alert(post.phone);

        };

        this.facebook.component.onclick = () => {

            window.open(post.socials[1], "_blank", "Facebook");
            // console.log();

        };

        this.email.component.onclick = () => {

            window.open("mailto:"+post.socials[0], "_blank", "Facebook");

        };

        this.contact.component.onclick = () => {

            Alert(`Контактні дані:<br><br><a target="_blank" href="${post.socials[1]}">Facebook</a><br><br><a href="mailto:${post.socials[0]}">${post.socials[0]}</a><br><br><a href="tel:${post.phone}">${post.phone}</a>`);

        };
        
        const name = post.fullName?.split(" ")[1] || "";
        const surname = post.fullName?.split(" ")[0] || post.fullName?.split(" ")[2] || "";

        this.fullname.innerText = name+" "+(surname[0] || "")+".";

        if(this.fullname.innerText == " .")
            this.fullname.innerText = "Користувач";
        
        let src = post.picture;
        if(src == null)
            src = "/src/profile.png";

        this.picture.innerHTML = `<img src="${src}">`;
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

function getDate (str: string) {

    // 2022-03-06T07:38:03.184+00:00

    return str.slice(0, 10).split("-").reverse().join(".");

}