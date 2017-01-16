import { sayFoo } from './modules/module1';

let element = document.createElement('h1');

element.innerHTML = sayFoo();

document.body.appendChild(element);
