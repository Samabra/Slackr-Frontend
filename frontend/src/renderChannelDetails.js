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
            const channelDetailHeader = document.createElement('h3');
            channelDetailHeader.innerText = 'Channel Details';
            channelDetails.appendChild(channelDetailHeader);

            const channelTitleLabel = document.createElement('label');
            channelTitleLabel.innerText = 'Name';
            const channelTitle = document.createElement('input')
            channelTitle.type = 'text';
            channelTitle.value = channel.name;
            channelTitle.disabled = true;

            const channelDescriptionLabel = document.createElement('label');
            channelDescriptionLabel.innerText = 'Channel Description';
            const channelDescription = document.createElement('textarea');
            if (channel.description === '') {
                channelDescription.placeholder = 'No description';
            } else {
                channelDescription.value = channel.description;
            }
            channelDescription.disabled = true;


            const visibility = document.createElement('p');
            visibility.innerText = channel.private ? 'Private': 'Public';


            const dateCreated = document.createElement('p');
            dateCreated.innerText = 'Created at: ' + new Date(channel.createdAt).toLocaleString();

            const stackLayout = document.createElement('div');
            stackLayout.style.display = 'flex';
            stackLayout.style.flexDirection = 'column';
            stackLayout.style.gap = '8px';

            stackLayout.appendChild(channelTitleLabel);
            stackLayout.appendChild(channelTitle);
            stackLayout.appendChild(channelDescriptionLabel);
            stackLayout.appendChild(channelDescription);
            stackLayout.appendChild(visibility);
            stackLayout.appendChild(dateCreated);
            channelDetails.appendChild(stackLayout);
            return getUser(channel.creator)
                .then(user => {
                    const creator = document.createElement('p');
                    creator.innerText = `Created by ${user.name}`;
                    channelDetails.appendChild(creator);
                    return channel;
                });
        })
        .then(channel => {
            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '8px';

            const editChannel = document.createElement('button');
            editChannel.innerText = 'Edit';
            editChannel.type = 'button';

            const saveChannel = document.createElement('button');
            saveChannel.type = 'button';
            saveChannel.innerText = 'Save';
            saveChannel.disabled = true;

            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.innerText = 'Cancel';
            cancelButton.disabled = true;

            actions.appendChild(editChannel);
            actions.appendChild(saveChannel);
            actions.appendChild(cancelButton);

            let originalName = channel.name;
            let originalDescription = channel.description;
            if (!channel.creator) {
                editChannel.disabled = true;
            }

            function enterEdit() {
                channelTitle.disabled = false;
                channelDescription.disabled = false;
                saveChannel.disabled = false;
                cancelButton.disabled = false;
            }

            function exitEdit(reset) {
                if (reset) {
                    channelTitle.value = originalName;
                    if (originalDescription = '') {
                        channelDescription.placeholder = 'No description';
                    } else {
                        channelDescription.value = originalDescription;
                    }
                }
                channelTitle.disabled = true;
                channelDescription.disabled = true;
                saveChannel.disabled = true;
                cancelButton.disabled = true;
                editButton
            }
            editChannel.addEventListener('click', () => {
                enterEdit();
            });

            cancelButton.addEventListener('click', () => {
                exitEdit(true);
            });

            saveChannel.addEventListener('click', () => {
                const newChannelTitle = channelTitle.value.trim();
                const newChannelDescription = (channelDescription.value || '').trim();
                if (!newChannelTitle) {
                    showError('Channel name is required');
                    return;
                }

                saveChannel.disabled = true;
                cancelButton.disabled = true;
                updateChannel(channel.id, newChannelTitle, newChannelDescription)
                    .then(() => {
                        
                    })
            })
        })

}