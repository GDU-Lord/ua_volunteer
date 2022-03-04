import * as dom from "../scripts/components.js";
import { HELPME, IHELP } from "../main.js";
export function create(parent) {
    const HELP_OPTIONS = parent.add(new dom.Div("help-options"));
    const helpme = HELP_OPTIONS.add(new dom.Button("helpme"));
    helpme.innerText = "Готові допомогти";
    const ihelp = HELP_OPTIONS.add(new dom.Button("ihelp"));
    ihelp.innerText = "Потребують допомоги";
    helpme.addClass("select");
    helpme.component.onclick = () => {
        HELPME.show();
        IHELP.hide();
        ihelp.remClass("select");
        helpme.addClass("select");
    };
    ihelp.component.onclick = () => {
        HELPME.hide();
        IHELP.show();
        ihelp.addClass("select");
        helpme.remClass("select");
    };
    return HELP_OPTIONS;
}
