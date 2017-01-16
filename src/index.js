import { sayHello } from './modules/module';

const name = 'World';

let element = document.createElement('h1');

element.innerHTML = sayHello(name);

document.body.appendChild(element);
