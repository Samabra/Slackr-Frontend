import { BACKEND_PORT } from './config.js';

// A helper you may want to use when uploading new images to the server.

import { fileToDataUrl } from './helpers.js';
import { renderHome } from './screens/home.js';
import { renderLogin } from './screens/login.js'
import { renderRegistration } from './screens/registration.js';

let TOKEN = localStorage.getItem('token');
const mount = document.querySelector('[role="main"]');

const token = localStorage.getItem('token');

const routes = {
    login: renderLogin,
    register: renderRegistration,
    home: renderHome,
};


  

function go(name) {
    while (mount.firstChild) {
        mount.removeChild(mount.firstChild);
    }
    
    const protectedScreen = new Set(['home']);
    if (!TOKEN && protectedScreen.has(name))
        name = 'register';
    const screen = routes[name];
    if (screen) {
        screen({ mount, go });
    }

}

if (TOKEN) {
    go('home');
} else {
    go('register');
}
