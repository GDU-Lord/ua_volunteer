import * as dom from "./scripts/components.js";
import * as login from "./pages/login.js";
import * as logout from "./pages/logout.js";
import * as signup from "./pages/signup.js";
import * as login_options from "./pages/login_options.js";
import * as helpme from "./pages/helpme.js";
import * as ihelp from "./pages/ihelp.js";
import * as help_options from "./pages/help_options.js";
import * as cities from "./pages/cities.js";
import * as cities2 from "./pages/cities2.js";
import * as page_options from "./pages/page_options.js";
import * as create from "./pages/create.js";
import { init } from "./scripts/alert.js";
export let botname;
fetch("/bot/name").then(res => res.text().then(res => botname = res));
window.addEventListener("scroll", () => {
    window.scroll(0, window.pageYOffset);
}, false);
export const body = new dom.Div("body");
export const head = new dom.Div("head");
export let USER = null;
init();
document.body.appendChild(body.component);
document.head.appendChild(head.component);
// head
export const TITLE = head.add(new dom.Title());
TITLE.innerText = "Volunteer UA - Український волонтерський портал";
// body
export const HEADER = body.add(new dom.Div("header"));
const title = HEADER.add(new dom.Div("title"));
const welcome = HEADER.add(new dom.Div("welcome"));
const logo = HEADER.add(new dom.HTMLComponent("object", "logo"));
const cover = body.add(new dom.HTMLComponent("object", "cover"));
cover.set("data", "/src/header2.svg");
title.innerText = "Volunteer UA";
welcome.innerText = "Ласкаво просимо на загальний\nволонтерський портал України.";
logo.set("data", "/src/logo.svg");
// option signup/login
export const LOGIN = login.create(body);
export const LOGOUT = logout.create(HEADER);
export const SIGNUP = signup.create(body);
export const LOGIN_OPTIONS = login_options.create(HEADER);
export const PAGE_OPTIONS = page_options.create(HEADER);
export const FIND = body.add(new dom.Div("find"));
export const CITIES = cities.create(FIND);
export const CREATE = body.add(new dom.Div("create"));
export const CITIES2 = cities2.create(CREATE);
export const _CREATE = create.create(CREATE);
export const find_title = FIND.add(new dom.Div("find-title"));
export const HELP_OPTIONS = help_options.create(FIND);
export const [HELPME, helpme_container] = helpme.create(FIND);
export const [IHELP, ihelp_container] = ihelp.create(FIND);
find_title.innerText = "Пошук оголошень";
LOGIN.hide();
LOGOUT.hide();
SIGNUP.hide();
LOGIN_OPTIONS.hide();
IHELP.hide();
HELPME.hide();
HELP_OPTIONS.hide();
CITIES.hide();
CREATE.hide();
PAGE_OPTIONS.hide();
FIND.hide();
export const guide = body.add(new dom.Div("guide"));
const heading = guide.add(new dom.Div("heading"));
heading.innerText = "Я хочу допомогти/потребую допомоги.\nЩо робити?";
const step1 = guide.add(new dom.Div("step1"));
const step2 = guide.add(new dom.Div("step2"));
const step3 = guide.add(new dom.Div("step3"));
step1.add(new dom.Div("", ["step"])).innerText = "Крок 1";
step1.add(new dom.Div("", ["title"])).innerText = "Зареєструйся";
step1.add(new dom.Div("", ["text"])).innerText = "Просимо підтвердити твою\nособистість задля безпечного\nкористування порталом.";
step2.add(new dom.Div("", ["step"])).innerText = "Крок 2";
step2.add(new dom.Div("", ["title"])).innerText = "Знайди або створи оголошення";
step2.add(new dom.Div("", ["text"])).innerText = "Для тих, хто потребує допомоги,\nми зібрали цілий список волонтерів.\nЯкщо ти сам волонтер - просто\nствори оголошення.";
step3.add(new dom.Div("", ["step"])).innerText = "Крок 3";
step3.add(new dom.Div("", ["title"])).innerText = "Зв'яжись із користувачем";
step3.add(new dom.Div("", ["text"])).innerText = "Це можна зробити за допомогою\nвказаного номеру телефону,\nпошти або Facebook.";
login.loginActive()
    .then(({ success, user = null }) => {
    USER = user;
    if (!success)
        return LOGIN_OPTIONS.show();
    LOGOUT.show();
    HELPME.show();
    HELP_OPTIONS.show();
    CITIES.show();
    PAGE_OPTIONS.show();
    FIND.show();
    guide.hide();
    if (page_options.createMode)
        PAGE_OPTIONS.byId("page").component.click();
    helpme.load();
    ihelp.load();
});
export function setUser(user) {
    USER = user;
}
// login page +
// signup page +
// loading ads +
// fix the ad duplication +
// ad pages +
// ad creation +
// ad myAds +
// ad editing +
// ad status changing +
// додати посилання в бота /
// додати події при кліках на контакти +
// додати ПІБ в пост +
// виправити баг із телефоном (коли не той тг все одно заходить) +
// додати "результатів не знайдено" +
// додати "зв'язатись" +
// додати заголовки +
// виправити стилі +
// додати текст "можна лише 1 повідомлення/чєла" +
// перенести на https
// додати посилання "на головну" під редактором
