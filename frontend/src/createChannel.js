import { API_BASE } from "./config.js";
import { showError } from "./errorPopup.js";

export function createChannel() {
    return new Promise((resolve, reject) => {
        const createChannelPopup = document.createElement('div');
        Object.assign(createChannelPopup.style, {
            position: 'fixed',
            inset: '0',
            bacgkround: 'rgba(0,0,0,0.4)',
            zIndex: '9998',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        });

        const createChannelTitle = document.createElement('h2');
        createChannelTitle.innerText = 'Create Channel';
        const channelNameLabel = document.createElement('label');
        channelNameLabel.innerText = 'Name';

        const channelName = document.createElement('input');
        channelName.id = 'create-channel-name';
        channelName.type = 'text';

        const channelDescriptionLabel = document.createElement('label');
        channelDescriptionLabel.innerText = 'Channel Description (Optional)';

        const channelDescription = document.createElement('input');
        channelDescription.id = 'create-channel-description';
        channelDescription.type = 'text';


        const channelPrivateLabel = document.createElement('label');
        channelPrivateLabel.innerText = 'Make Channel Private';

        const channelPrivate = document.createElement('input');
        channelPrivate.id = 'create-channel-is-private';
        channelPrivate.type = 'checkbox';
        
        const createChannelSubmit = document.createElement('button');
        createChannelSubmit.id = 'create-channel-submit';
        createChannelSubmit.innerText = 'Create Channel';

        const createChannelPopupClose = document.createElement('button');
        createChannelPopupClose.type = 'button';
        createChannelPopupClose.textContent = '✖';
        createChannelPopupClose.style.alignSelf = 'flex-end';
        createChannelPopupClose.addEventListener('click', () => document.body.removeChild(createChannelPopup));

        createChannelPopup.appendChild(createChannelPopupClose);
        createChannelPopup.appendChild(createChannelTitle);
        createChannelPopup.appendChild(document.createElement('br'));
        createChannelPopup.appendChild(channelNameLabel);
        createChannelPopup.appendChild(channelName);
        createChannelPopup.appendChild(document.createElement('br'));
        createChannelPopup.appendChild(channelDescriptionLabel);
        createChannelPopup.appendChild(channelDescription);
        createChannelPopup.appendChild(document.createElement('br'));
        createChannelPopup.appendChild(channelPrivateLabel);
        createChannelPopup.appendChild(channelPrivate);
        createChannelPopup.appendChild(document.createElement('br'));
        createChannelPopup.appendChild(createChannelSubmit);
        document.body.appendChild(createChannelPopup);

        createChannelSubmit.addEventListener('click', () => {
            const name = channelName.value.trim();
            const description = (channelDescription.value || '').trim();
            const isPrivate = channelPrivate.checked;
            if (!name) {
                showError('A channel name is required.');
                return;
            }
            createChannelSubmit.disabled = true;
            newChannel(name, isPrivate, description, createChannelPopup)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    showError(err.message || 'Somethign went wrong when trying to create a new channel');
                    reject(err);
                })
                .finally(() => {
                    createChannelSubmit.disabled = false;
                });        
        });
    });
}


const newChannel = (name, isPrivate, description, createChannelPopup) => {
    fetch(`${API_BASE}/channel`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            name: name,
            private: isPrivate,
            description: description,
        })
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to create new channel');
            }
            document.body.removeChild(createChannelPopup);

            document.dispatchEvent(new CustomEvent('channel:created', { detail: data }));
            return data;
        })
};