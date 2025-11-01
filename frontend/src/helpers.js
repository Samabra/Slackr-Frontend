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

    })
    .catch(err => {
        showError(err.message || 'Something went wrong in loading the channels');
    })
}