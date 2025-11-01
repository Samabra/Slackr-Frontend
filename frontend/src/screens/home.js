import { API_BASE } from '../config.js';
import { createChannel } from '../createChannel.js';
import { renderChannels } from '../helpers.js';

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
    sidebar.appendChild(createChannelButton);


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
    
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
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

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        go('login');
    });

    renderChannels(channelListPublic, channelListPrivate);

    createChannelButton.addEventListener('click', () => {
        createChannel(channelListPublic, channelListPrivate);
    })
}


