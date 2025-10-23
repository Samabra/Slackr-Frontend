import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

import { renderLogin } from './screens/login.js'


const mount = document.getElementById('app');

const routes = {
    login: renderLogin,
};

c
function go(name) {
    mount.innerHTML = '';

    const protectedScreens = new Set(['home']);

    if (!token && protectedScreens.has(name)) {
        name = 'login';
    }
    const screen = routes[name];
    screen({ mount, go });
}

const token = localStorage.getItem('slackr_token');
if (token) {
    go('home');
} else {
    go('login')
}
