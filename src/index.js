import sayHey from './modules/module1';

let element = document.createElement('h1');

element.innerHTML = sayHey();

document.body.appendChild(element);
