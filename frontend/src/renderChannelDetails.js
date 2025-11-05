import { API_BASE } from "./config.js";
import { showError } from "./errorPopup.js";
import { renderChannels } from "./helpers.js";
import { getUser } from "./helpers.js";
import { getChannel } from "./helpers.js";


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



export function renderChannelDetails(channelDetails, channelId, channelLists) {
    while (channelDetails.firstChild) {
        channelDetails.removeChild(channelDetails.firstChild);
    }
    return getChannel(channelId)
        .then(channel => {
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
                    return { channel, channelTitle, channelDescription };
                });
        })
        .then(({ channel, channelTitle, channelDescription }) => {
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

            const leaveButton = document.createElement('button');
            leaveButton.type = 'button';
            leaveButton.innerText = 'Leave Channel';

            actions.appendChild(editChannel);
            actions.appendChild(saveChannel);
            actions.appendChild(cancelButton);
            channelDetails.appendChild(actions);
            channelDetails.appendChild(leaveButton);

            let originalName = channel.name;
            let originalDescription = channel.description;

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
                editChannel.disabled = false;
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
                updateChannel(channelId, newChannelTitle, newChannelDescription)
                    .then(() => {
                        if (channelLists && channelLists.channelListPublic && channelLists.channelListPrivate) {
                            console.log('I am now updating the channel')
                            return renderChannels(channelLists.channelListPublic, channelLists.channelListPrivate);
                        }
                    })
                    .then(() => {
                        return renderChannels(channelLists.channelListPublic, channelLists.channelListPrivate);
                    })
                    .catch(err => {
                        console.log('I failed to update the channels');
                        console.log(err.message);
                        showError(err.message || 'Failed to update channels');
                        saveChannel.disabled = false;
                        cancelButton.disable = false;
                    })
                    .finally(() => {
                        exitEdit();
                    });
            });

            leaveButton.addEventListener('click', () => {
                leaveChannel(channelId)
                    .then(() => renderChannels(channelLists.channelListPublic, channelLists.channelListPrivate))
                    .then(() => renderChannelDetails(channelDetails, channelId, channelLists))
                    .then(err => showError(err.message || 'Failed to leave channel'))
            });
            return null;
        })
        .catch(err => {
            const title = document.createElement('h3');
            title.innerText = 'Channel Details';
            channelDetails.appendChild(title);

            const notMember = document.createElement('p');
            notMember.innerText = "You're not a member of this channel. Join this channel to start a conversation";
            channelDetails.appendChild(notMember);
            const joinChannelButton = document.createElement('button');
            joinChannelButton.textContent = "Join Channel";
            channelDetails.appendChild(joinChannelButton);

            joinChannelButton.addEventListener('click', () => {
                joinChannel(channelId)
                    .then(() => renderChannels(channelLists.channelListPublic, channelLists.channelListPrivate))
                    .then(() => renderChannelDetails(channelDetails, channelId, channelLists))
                    .catch(err => showError(err.message || 'Failed to join channel'))
            });
            return;
        });



}