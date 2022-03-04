import * as dom from "../scripts/components.js";
import { CREATE, FIND } from "../main.js";
import * as _create from "../pages/create.js";
export let createMode = false;
export function create(parent) {
    const PAGE_OPTIONS = parent.add(new dom.Div("page-options"));
    const page = PAGE_OPTIONS.add(new dom.Button("page"));
    page.innerText = "Додати оголошення";
    // const find = PAGE_OPTIONS.add(new dom.Button("find")) as dom.Button;
    // find.innerText = "Шукати";
    page.component.onclick = () => {
        if (createMode) {
            CREATE.hide();
            FIND.show();
            createMode = false;
            page.innerText = "Додати оголошення";
            return;
        }
        CREATE.show();
        FIND.hide();
        const helpme = CREATE.component.querySelector("#helpme");
        const ihelp = CREATE.component.querySelector("#ihelp");
        if (helpme.checked)
            _create.update("helpme");
        if (ihelp.checked)
            _create.update("ihelp");
        createMode = true;
        page.innerText = "Шукати оголошення";
    };
    return PAGE_OPTIONS;
}
