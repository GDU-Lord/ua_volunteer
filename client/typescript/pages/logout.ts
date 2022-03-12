import * as dom from "../scripts/components.js";
import { TITLE, body, head, setUser, LOGIN_OPTIONS, CITIES, HELPME, HELP_OPTIONS, PAGE_OPTIONS, CREATE, FIND, guide } from "../main.js";
import { Alert } from "../scripts/alert.js";
import error from "../scripts/error.js";

export function create (parent: dom.HTMLComponent) {
    const LOGOUT = parent.add(new dom.Div("logout")) as dom.HTMLInner;

    const submit = LOGOUT.add(new dom.Button("logout")) as dom.Button;
    submit.innerText = "Вийти";
    
    submit.component.onclick = async () => {

        submit.set("disabled", "disabled");

        const res = await fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const {success, code, reason} = await res.json() as any;

        if(!success) {
            await Alert(error(reason));
            submit.unset("disabled");
            return;
        }
        else {
            submit.unset("disabled");
            setUser(null);
            LOGOUT.hide();
            LOGIN_OPTIONS.show();
            HELPME.hide();
            HELP_OPTIONS.hide();
            CITIES.hide();
            PAGE_OPTIONS.hide();
            CREATE.hide();
            FIND.hide();
            guide.show();
        }
    
    }
    return LOGOUT;
}