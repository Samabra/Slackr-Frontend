import { BACKEND_PORT } from '../config.js';

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
    sideBarNote.innerText = 'Channels/DMs';
    sidebar.appendChild(sideBarTitle);
    sidebar.appendChild(sideBarNote);

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
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        go('login');
    });

    header.appendChild(title);
    header.appendChild(logoutButton);

    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.padding = '16px';

    const text = document.createElement('p');
    empty.innerText = 'Messages will show up here';
    content.appendChild(text);

    main.appendChild(header);
    main.appendChild(content);
    screen.appendChild(sidebar);
    mount.appendChild(screen);

}