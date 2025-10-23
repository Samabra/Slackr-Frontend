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
    
    if (name === 'login') {
        renderLogin({ mount, go });
    }
}


const token = localStorage.getItem('slackr_token');
if (token) {
    go('login');
}

