import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

import { renderLogin } from './screens/login.js'


const mount = document.querySelector('[role="main"]');

const routes = {
    login: renderLogin,
};


function go(name) {
    while (mount.firstChild) {
        mount.removeChild(mount.firstChild);
    }
    const token = localStorage.getItem('token');
    const protectedScreen = new Set(['home']);
    if (!token && protectedScreen.has(name)) {
        name = 'login';
    }

    const screen = routes[name];
    if (screen) {
        screen({ mount, go });
    }
}


go('login');