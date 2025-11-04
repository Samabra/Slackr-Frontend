/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */

import { API_BASE } from "./config.js";
import { showError } from "./errorPopup.js";

export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

export function renderChannels(channelListPublic, channelListPrivate) {
    return fetch(`${API_BASE}/channel`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    .then(res => res.json().then(data => ({ ok: res.ok, data})))
    .then(({ ok, data }) => {
        if (!ok) {
            throw new Error(data.error || 'Failed to load channels');
        }
        while (channelListPublic.firstChild) {
            channelListPublic.removeChild(channelListPublic.firstChild);
        }
        while (channelListPrivate.firstChild) {
            channelListPrivate.removeChild(channelListPrivate.firstChild);
        }
        const channels = data.channels;

        for (let i = 0; i < channels.length; i++) {
            const ch = channels[i];
            const channelButton = document.createElement('button');
            channelButton.type = 'button';
            channelButton.dataset.id = ch.id;
            if (ch.private) {
                channelButton.textContent = `* ${ch.name}`;
                channelListPrivate.appendChild(channelButton);
            } else {
                channelButton.textContent = `# ${ch.name}`;
                channelListPublic.appendChild(channelButton);
            }
        }
        return channels;
    })
    .catch(err => {
        showError(err.message || 'Something went wrong in loading the channels');
    })
}

export function getUser(userId) {
    return fetch(`${API_BASE}/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data})))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to get user details');
            }
            return data;
        })
}


export function makeLoader() {
    const loadingSpace = document.createElement('div');
    loadingSpace.style.display = 'flex';
    loadingSpace.style.justifyContent = 'center';
    loadingSpace.style.alignItems = 'center';
    loadingSpace.style.padding = '8px';
    loadingSpace.style.color = '#666';
    loadingSpace.style.fontSize = '12px';

    const dot = document.createElement('div');
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '50%';
    dot.style.border = '2px solid #ccc';
    dot.style.borderTopColor = '#999';
    dot.style.animation = 'spin 0.8s linear infinite';
    loadingSpace.appendChild(dot);

    if (!document.getElementById('spin-keyframes')) {
        const style = document.createElement('style');
        style.id = 'spin-keyframes';
        style.textContent = `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
    }
    return loadingSpace;
}