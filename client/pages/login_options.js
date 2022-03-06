import * as dom from "../scripts/components.js";
import { SIGNUP, LOGIN, guide } from "../main.js";
export function create(parent) {
    const LOGIN_OPTIONS = parent.add(new dom.Div("login-options"));
    const login = LOGIN_OPTIONS.add(new dom.Button("login-button"));
    login.innerText = "Вхід";
    const signup = LOGIN_OPTIONS.add(new dom.Button("signup-button"));
    signup.innerText = "Реєстрація";
    login.component.onclick = () => {
        // LOGIN_OPTIONS.hide();
        LOGIN.show();
        SIGNUP.hide();
        guide.hide();
    };
    signup.component.onclick = () => {
        // LOGIN_OPTIONS.hide();
        SIGNUP.show();
        LOGIN.hide();
        guide.hide();
    };
    return LOGIN_OPTIONS;
}
