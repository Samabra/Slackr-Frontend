import { API_BASE } from './config.js';

import { fileToDataUrl } from './helpers.js';
import { renderHome } from './screens/home.js';
import { renderLogin } from './screens/login.js'
import { renderRegistration } from './screens/registration.js';
import { renderProfile } from './screens/profile.js';

let TOKEN = localStorage.getItem('token');
const mount = document.querySelector('[role="main"]');


const routes = {
    login: renderLogin,
    register: renderRegistration,
    home: renderHome,
    profile: renderProfile,
};

function go(name) {
    while (mount.firstChild) {
        mount.removeChild(mount.firstChild);
    }
    const token = localStorage.getItem('token');
    const protectedScreen = new Set(['home', 'profile']);
    if (!token && protectedScreen.has(name))
        name = 'register';
    const screen = routes[name];
    console.log(screen);
    if (screen) {
        screen({ mount, go });
    }

}

if (TOKEN) {
    go('home');
} else {
    go('register');
}
