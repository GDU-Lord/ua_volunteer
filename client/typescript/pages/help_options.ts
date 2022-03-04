import * as dom from "../scripts/components.js";
import { body, head, SIGNUP, LOGIN, HELPME, IHELP, FIND } from "../main.js";

export function create (parent: dom.HTMLComponent) {

    const HELP_OPTIONS = parent.add(new dom.Div("help-options")) as dom.HTMLInner;

    const helpme = HELP_OPTIONS.add(new dom.Button("helpme")) as dom.Button;
    helpme.innerText = "Готові допомогти";

    const ihelp = HELP_OPTIONS.add(new dom.Button("ihelp")) as dom.Button;
    ihelp.innerText = "Потребують допомоги";

    helpme.addClass("select");
    
    helpme.component.onclick = () => {

        HELPME.show();
        IHELP.hide();
        ihelp.remClass("select");
        helpme.addClass("select");
    
    }

    ihelp.component.onclick = () => {

        HELPME.hide();
        IHELP.show();
        ihelp.addClass("select");
        helpme.remClass("select");

    }

    return HELP_OPTIONS;

}