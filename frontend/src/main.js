import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

import { renderLogin } from './screens/login.js'

export const mount = document.getElementById('app');