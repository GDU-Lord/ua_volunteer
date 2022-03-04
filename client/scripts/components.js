export class HTMLComponent {
    component;
    parent;
    children;
    index;
    constructor(tag, id = null, classList = []) {
        this.component = document.createElement(tag);
        this.addClass(...classList);
        this.parent = null;
        this.children = [];
        this.index = null;
        if (id != null)
            this.component.id = id;
    }
    addClass(...name) {
        this.component.classList.add(...name);
        return this;
    }
    remClass(...name) {
        this.component.classList.remove(...name);
        return this;
    }
    getClass(name) {
        this.component.classList.contains(name);
    }
    add(component) {
        component.index = this.children.length;
        this.component.appendChild(component.component);
        this.children[component.index] = component;
        component.parent = this;
        return component;
    }
    remove(component) {
        this.component.removeChild(component.component);
        delete this.children[component.index];
        component.parent = null;
        return component;
    }
    get(attr) {
        return this.component.getAttribute(attr);
    }
    set(attr, data) {
        this.component.setAttribute(attr, data);
        return this;
    }
    unset(attr) {
        this.component.removeAttribute(attr);
        return this;
    }
    hide() {
        this.addClass("hidden");
    }
    show() {
        this.remClass("hidden");
    }
    get id() {
        return this.component.id;
    }
}
export class HTMLInner extends HTMLComponent {
    constructor(tag, id, classList) {
        super(tag, id, classList);
    }
    get innerText() {
        return this.component.innerText;
    }
    set innerText(data) {
        this.component.innerText = data;
    }
    get innerHTML() {
        return this.component.innerHTML;
    }
    set innerHTML(data) {
        this.component.innerHTML = data;
    }
    query(data, all = false) {
        return this.component.querySelector(data);
    }
    queryAll(data, all = false) {
        return this.component.querySelectorAll(data);
    }
    byId(data) {
        for (const child of this.children) {
            if (child.id == data)
                return child;
        }
        return null;
    }
}
export class HTMLValue extends HTMLComponent {
    constructor(tag, id, classList) {
        super(tag, id, classList);
    }
    get value() {
        return this.component.value;
    }
    set value(data) {
        this.component.value = data;
    }
}
export class Br extends HTMLInner {
    constructor(id, classList = []) {
        super("br", id, classList);
    }
}
export class Meta extends HTMLInner {
    constructor(id, classList = []) {
        super("meta", id, classList);
    }
}
export class H extends HTMLInner {
    constructor(n, id, classList = []) {
        super("h" + n, id, classList);
    }
}
export class P extends HTMLInner {
    constructor(id, classList = []) {
        super("p", id, classList);
    }
}
export class A extends HTMLInner {
    constructor(href, id, classList = []) {
        super("a", id, classList);
        this.href = href;
    }
    get href() {
        return this.component.href;
    }
    set href(data) {
        this.component.href = data;
    }
}
export class Title extends HTMLInner {
    constructor(id, classList = []) {
        super("title", id, classList);
    }
}
export class Div extends HTMLInner {
    constructor(id, classList = []) {
        super("div", id, classList);
    }
}
export class Input extends HTMLValue {
    constructor(id, classList = []) {
        super("input", id, classList);
    }
}
export class Button extends HTMLInner {
    constructor(id, classList = []) {
        super("button", id, classList);
    }
}
