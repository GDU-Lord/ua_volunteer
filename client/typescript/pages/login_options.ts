import * as dom from "../scripts/components.js";
import { body, head, SIGNUP, LOGIN, guide } from "../main.js";

export function create (parent: dom.HTMLComponent) {

    const LOGIN_OPTIONS = parent.add(new dom.Div("login-options")) as dom.HTMLInner;

    const login = LOGIN_OPTIONS.add(new dom.Button("login-button")) as dom.Button;
    login.innerText = "Вхід";

    const signup = LOGIN_OPTIONS.add(new dom.Button("signup-button")) as dom.Button;
    signup.innerText = "Реєстрація";
    
    login.component.onclick = () => {

        // LOGIN_OPTIONS.hide();
        LOGIN.show();
        SIGNUP.hide();
        guide.hide();
    
    }

    signup.component.onclick = () => {

        // LOGIN_OPTIONS.hide();
        SIGNUP.show();
        LOGIN.hide();
        guide.hide();

    }

    return LOGIN_OPTIONS;

}