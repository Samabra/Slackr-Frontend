import { API_BASE, BACKEND_PORT } from "./config.js";
import { showError } from "./errorPopup.js";
import { getUser } from "./helpers.js";

function getMessages(channelId, start) {
    return fetch(`${API_BASE}/message/${channelId}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data})))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to load channel details');
            }
            return data;
        })
}


function sendMessages(channelId, message, image) {
    return fetch(`${API_BASE}/message/${channelId}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            message: message,
            image: image,
        })
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data})))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to load channel details');
            }
            return data;
        })
}

function buildMessage(message, user) {
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'message-container';
    messagesContainer.
}

export function renderMessages(channelId, messagesPane) {
    while (messagesPane.firstChild) {
        messagesPane.removeChild(messagesPane.firstChild);
    }


    return getMessages(channelId, start)
        .then

}
