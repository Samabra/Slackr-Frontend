import { BACKEND_PORT } from "./config";
import { showError } from "./errorPopup";

const API_BASE = `http://localhost:${BACKEND_PORT}`;


export function createChannel() {

    const createChannelPopup = document.createElement('div');

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

    createChannelSubmit.addEventListener('click', () => {
        const name = channelName.value.trim();
        const description = channelDescription.value;
        const isPrivate = !!channelPrivate.checked;
        newChannel(name, isPrivate, description);
    })


}


const newChannel = (name, isPrivate, description) => {
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
        .then(res => res.json(),then(data => ({ ok: res.ok, data })))
        ,then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to create new channel');
            }
        })
        .catch(err => {
            showError(err.message || 'Something went wrong when trying to create a new channel');
        });
};