import { API_BASE } from "./config.js";
import { showError } from "./errorPopup.js";
import { renderChannels } from "./helpers.js";

function getChannel(channelId) {
    return fetch(`${API_BASE}/channel/${channelId}`, {
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


function updateChannel(channelId, name, description) {
    return fetch(`${API_BASE}/channel/${channelId}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify ({
            name: name,
            description: description,
        })
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data})))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to update channel details');
            }
            return data;
        })
}

function joinChannel(channelId) {
    return fetch(`${API_BASE}/channel/${channelId}/join`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data})))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to join channel');
            }
            return data;
        })
}

function leaveChannel(channelId) {
    return fetch(`${API_BASE}/channel/${channelId}/leave`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data})))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to leave channel');
            }
            return data;
        })
}

function getUser(userId) {
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
                throw new Error(data.error || 'Failed to get user details channel');
            }
            return data;
        })
}


export function renderChannelDetails(channelDetails, channelId, channelLists) {
    return getChannel(channelId)
        .then(channel => {
            while (channelDetails.firstChild) {
                channelDetails.removeChild(channelDetails.firstChild);
            }
            const channelTitle = document.createElement('h3');
            channelTitle.innerText = channel.name;
            channelDetails.appendChild(channelTitle);
            const channelDescription = document.createElement('p');
            if (channelDescription === '') {
                channelDescription.innerText = 'No description';
            } else {
                channelDescription.innerText = channel.description;
            }
            channelDetails.appendChild(channelDescription);
            const visibility = document.createElement('p');
            visibility.innerText = channel.private ? 'Private': 'Public';
            
            const dateCreated = document.createElement('p');
            dateCreated.innerText = 'Created at: ' + new Date(channel.createdAt).toLocaleString();

            return getUser(channel.creator)
                .then(user => {
                    const creator = document.createElement('p');
                    creator.innerText = `Created by ${user.name}`;
                    return channel;
                })

        })
}