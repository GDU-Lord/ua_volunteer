import * as dom from "../scripts/components.js";
import { body, head, SIGNUP, LOGIN, CREATE, FIND } from "../main.js";
import * as _create from "../pages/create.js";

export let createMode: boolean = false;

export function create (parent: dom.HTMLComponent) {

    const PAGE_OPTIONS = parent.add(new dom.Div("page-options")) as dom.HTMLInner;

    const page = PAGE_OPTIONS.add(new dom.Button("page")) as dom.Button;
    page.innerText = "Додати оголошення";

    // const find = PAGE_OPTIONS.add(new dom.Button("find")) as dom.Button;
    // find.innerText = "Шукати";
    
    page.component.onclick = () => {

        if(createMode) {

            CREATE.hide();
            FIND.show();

            createMode = false;
            page.innerText = "Додати оголошення";

            return;
        }

        CREATE.show();
        FIND.hide();

        const helpme = CREATE.component.querySelector("#helpme") as HTMLInputElement;
        const ihelp = CREATE.component.querySelector("#ihelp") as HTMLInputElement;

        if(helpme.checked)
            _create.update("helpme");
        if(ihelp.checked)
            _create.update("ihelp");

        createMode = true;
        page.innerText = "Шукати оголошення";
            
    
    }

    return PAGE_OPTIONS;

}