export class HTMLComponent {

    component: HTMLElement;
    parent: HTMLComponent;
    children: HTMLComponent[];
    index: number;

    constructor (tag: string, id: string = null, classList: string[] = []) {

        this.component = document.createElement(tag);
        this.addClass(...classList);
        this.parent = null;
        this.children = [];
        this.index = null;
        if(id != null)
            this.component.id = id;

    }

    addClass (...name: string[]) {
        this.component.classList.add(...name);
        return this;
    }

    remClass (...name: string[]) {
        this.component.classList.remove(...name);
        return this;
    }

    getClass (name: string) {
        this.component.classList.contains(name);
    }

    add (component: HTMLComponent) {

        component.index = this.children.length;
        this.component.appendChild(component.component);
        this.children[component.index] = component;
        component.parent = this;
        return component;

    }

    remove (component: HTMLComponent) {

        this.component.removeChild(component.component);
        delete this.children[component.index];
        component.parent = null;
        return component;

    }

    get (attr: string) {
        return this.component.getAttribute(attr);
    }

    set (attr: string, data: string) {
        this.component.setAttribute(attr, data);
        return this;
    }

    unset (attr: string) {
        this.component.removeAttribute(attr);
        return this;
    }

    hide () {

        this.addClass("hidden");

    }

    show () {

        this.remClass("hidden");

    }

    get id () {
        return this.component.id;
    }

}

export class HTMLInner extends HTMLComponent {

    constructor (tag: string, id?: string, classList?: string[]) {

        super(tag, id, classList);

    }

    get innerText () {

        return this.component.innerText;

    }

    set innerText (data: string) {

        this.component.innerText = data;

    }

    get innerHTML () {

        return this.component.innerHTML;

    }

    set innerHTML (data: string) {

        this.component.innerHTML = data;

    }

    query (data: string, all: boolean = false) {

        return this.component.querySelector(data)

    }

    queryAll (data: string, all: boolean = false) {

        return this.component.querySelectorAll(data);

    }

    byId (data: string) {

        for(const child of this.children) {
            if(child.id == data)
                return child;
        }

        return null;

    }

}

export class HTMLValue extends HTMLComponent {

    declare component: HTMLDataElement;

    constructor (tag: string, id?: string, classList?: string[]) {

        super(tag, id, classList);

    }

    get value () {

        return this.component.value;

    }

    set value (data: string) {

        this.component.value = data;

    }

}

export class Br extends HTMLInner {

    constructor (id?: string, classList: string[] = []) {

        super("br", id, classList);

    }

}

export class Meta extends HTMLInner {

    constructor (id?: string, classList: string[] = []) {

        super("meta", id, classList);

    }

}

export class H extends HTMLInner {

    constructor (n: number, id?: string, classList: string[] = []) {

        super("h"+n, id, classList);

    }

}

export class P extends HTMLInner {

    constructor (id?: string, classList: string[] = []) {

        super("p", id, classList);

    }

}

export class A extends HTMLInner {

    declare component: HTMLLinkElement;

    constructor (href: string, id?: string, classList: string[] = []) {

        super("a", id, classList);

        this.href = href;

    }
    
    get href () {

        return this.component.href;

    }

    set href (data: string) {

        this.component.href = data;

    }

}

export class Title extends HTMLInner {

    constructor (id?: string, classList: string[] = []) {

        super("title", id, classList);

    }

}

export class Div extends HTMLInner {

    constructor (id?: string, classList: string[] = []) {

        super("div", id, classList);

    }

}

export class Input extends HTMLValue {

    constructor (id?: string, classList: string[] = []) {

        super("input", id, classList);

    }

}

export class Button extends HTMLInner {

    constructor (id?: string, classList: string[] = []) {

        super("button", id, classList);

    }

}