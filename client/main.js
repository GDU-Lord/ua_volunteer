import * as dom from "./scripts/components.js";
import * as login from "./pages/login.js";
import * as logout from "./pages/logout.js";
import * as signup from "./pages/signup.js";
import * as login_options from "./pages/login_options.js";
import * as helpme from "./pages/helpme.js";
import * as ihelp from "./pages/ihelp.js";
import * as help_options from "./pages/help_options.js";
import * as cities from "./pages/cities.js";
import * as page_options from "./pages/page_options.js";
import * as create from "./pages/create.js";
export const body = new dom.Div("body");
export const head = new dom.Div("head");
export let USER = null;
document.body.appendChild(body.component);
document.head.appendChild(head.component);
// head
head.add(new dom.Title()).innerText = "Заголовок";
// body
export const HEADER = body.add(new dom.Div("header"));
const title = HEADER.add(new dom.Div("title"));
const welcome = HEADER.add(new dom.Div("welcome"));
// const banner = HEADER.add(new dom.HTMLComponent("object", "banner")) as dom.HTMLComponent;
// banner.set("data", "/src/header.svg");
title.innerText = "Волонтери України";
welcome.innerText = "Ласкаво просимо на загальну\nволонтерську базу українських міст.";
// option signup/login
export const LOGIN = login.create(body);
export const LOGOUT = logout.create(HEADER);
export const SIGNUP = signup.create(body);
export const LOGIN_OPTIONS = login_options.create(HEADER);
export const PAGE_OPTIONS = page_options.create(HEADER);
export const FIND = body.add(new dom.Div("find"));
export const CITIES = cities.create(FIND);
export const CREATE = body.add(new dom.Div("create"));
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
// ad status changing
// login & signup timeout (30s)
// login & signup field verification
// styles
