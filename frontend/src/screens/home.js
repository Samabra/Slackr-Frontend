
import { createChannel } from '../createChannel.js';
import { renderChannels } from '../helpers.js';
import { renderChannelDetails } from '../renderChannelDetails.js';
import { renderMessages } from '../renderMessages.js';

function channelClicks(listElement, channelDetails, channelListPublic, channelListPrivate, messagesPane) {
    listElement.addEventListener('click', (e) => {
        const channelButton = e.target.closest('button[data-id]');
        if (!channelButton) {
            return;
        }
        const channelId = Number(channelButton.dataset.id);
        renderChannelDetails(channelDetails, channelId, { channelListPublic, channelListPrivate });
        renderMessages(channelId, messagesPane)
    });
}

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

    const body = document.createElement('div');
    body.style.display = 'flex';
    body.style.flex = '1';
    body.style.minHeight = '0';

    const messagesPane = document.createElement('div');
    messagesPane.style.flex = '2';
    messagesPane.style.padding = '16px';
    messagesPane.style.borderRight = '1px solid #eee';

    const messagesPlaceHolder = document.createElement('p');
    messagesPlaceHolder.innerText = 'Messages will go here';
    messagesPane.appendChild(messagesPlaceHolder);

    const channelDetails = document.createElement('aside');
    channelDetails.id = 'channel-details-container';
    channelDetails.style.display = 'flex';
    channelDetails.style.flexDirection = 'column';
    channelDetails.style.flex = '1';
    channelDetails.style.gap = '8px';
    channelDetails.style.padding = '16px';
    channelDetails.style.border = '1px solid #eee';

    channelClicks(channelListPublic, channelDetails, channelListPublic, channelListPrivate, messagesPane);
    channelClicks(channelListPrivate, channelDetails, channelListPublic, channelListPrivate, messagesPane);

    const placeHolderText = document.createElement('p');
    placeHolderText.innerText = 'Select a channel to view details';
    channelDetails.appendChild(placeHolderText);

    const title = document.createElement('h2');
    title.innerText = 'Home';
    
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
    header.appendChild(title);
    header.appendChild(logoutButton);

    body.appendChild(messagesPane);
    body.appendChild(channelDetails);
    main.appendChild(header);
    main.appendChild(body);
    screen.appendChild(sidebar);
    screen.appendChild(main);
    mount.appendChild(screen); 

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        go('login');
    });

    renderChannels(channelListPublic, channelListPrivate);

    createChannelButton.addEventListener('click', () => {
        createChannel().then(() => {
            renderChannels(channelListPublic, channelListPrivate);
        });
    });
}


