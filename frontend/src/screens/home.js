import { BACKEND_PORT } from '../config.js';
import { createChannel } from '../createChannel.js';

const API_BASE = `http://localhost:${BACKEND_PORT}`;

export function renderHome({ mount, go }) {

    const screen = document.createElement('div');
    screen.style.display = 'flex';
    screen.style.minHeight = '80vh';

    const sidebar = document.createElement('aside');
    sidebar.style.width = '240px';
    sidebar.style.borderRight = '1px solid #eee';
    sidebar.style.padding = '12px';

    const sideBarTitle = document.createElement('h3');
    sideBarTitle.innerText = 'Navigate To';
    const sideBarNote = document.createElement('p');
    sideBarNote.innerText = 'Channels';
    sidebar.appendChild(sideBarTitle);
    sidebar.appendChild(sideBarNote);

    const createChannelButton = document.createElement('button');
    createChannelButton.innerText = 'Create Channel';
    createChannelButton.id = 'create-channel-button';
    sidebar.appendChild(createChannel);


    const channelList = document.createElement('div');
    channelList.classList.add('channel-list');
    channelList.style.display = 'flex';
    channelList.style.flexDirection = 'column';
    channelList.style.gap = '5px';
    sidebar.appendChild(channelList);

    const channelListPublic = document.createElement('div');
    channelListPublic.style.display = 'flex';
    channelListPublic.style.flexDirection = 'column';
    channelListPublic.style.gap = '5px';
    channelList.appendChild(channelListPublic);

    const channelListPrivate = document.createElement('div');
    channelListPrivate.style.display = 'flex';
    channelListPrivate.style.flexDirection = 'column';
    channelListPrivate.style.gap = '5px';
    channelList.appendChild(channelListPrivate);

    renderChannels(channelListPublic, channelListPrivate);
    const main = document.createElement('section');
    main.style.display = 'flex';
    main.style.flex = '1';
    main.style.flexDirection = 'column';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.padding = '12px';
    header.style.borderBottom = '1px solid #eee';

    const title = document.createElement('h2');
    title.innerText = 'Home';

    header.appendChild(title);
    header.appendChild(logoutButton);

    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.padding = '16px';

    const text = document.createElement('p');
    text.innerText = 'Messages will show up here';
    content.appendChild(text);

    main.appendChild(header);
    main.appendChild(content);
    screen.appendChild(sidebar);
    screen.appendChild(main);
    mount.appendChild(screen); 

    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        go('login');
    });

    createChannelButton.addEventListener('click', () => {
        createChannel();
        renderChannels();
    })
}


const renderChannels = (channelListPublic, channelListPrivate) => {
    fetch(`${API_BASE}/channel`, {
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
            channelButton.textContent = `# ${ch.name}`;
            channelButton.dataset.id = ch.id;
            if (ch.private) {
                channelListPrivate.appendChild(channelButton);
            } else {
                channelListPublic.appendChild(channelButton);
            }
        }

    })
    .catch(err => {
        showError(err.message || 'Something went wrong in loading the channels');
    })
}