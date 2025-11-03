import { API_BASE } from "./config.js";
import { showError } from "./errorPopup.js";
import { getUser } from "./helpers.js";
import { fileToDataUrl } from "./helpers.js";

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
    messagesContainer.style.display = 'flex';
    messagesContainer.style.gap = '10px';
    messagesContainer.style.padding = '8px 0';
    messagesContainer.style.borderBottom = '1px solid #eee';

    const avatar = document.createElement('img');
    avatar.alt = 'avatar';
    avatar.width = 36;
    avatar.height = 36;
    avatar.style.borderRadius = '50%';

    const fallback = 
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxOCIgY3k9IjEzIiByPSI4IiBmaWxsPSIjZGRkIi8+PHBhdGggZD0iTTkgMjkuNWMwLTQuNCAzLjYtOC41IDktOC41czkgNC4xIDkgOC41IiBmaWxsPSIjZGRkIi8+PC9zdmc+';
    avatar.src = (user.image && user.image.startsWith('data:')) ? user.image : fallback;

    const main = document.createElement('div');
    main.style.flex = '1';

    const head = document.createElement('div');
    head.style.display = 'flex';
    head.style.gap = '8px';
    head.style.alignItems = 'baseline';

    const name = document.createElement('strong');
    name.textContent = `${user.name}`;

    const time = document.createElement('span');
    time.style.color = '#666';
    time.textContent = message.edited ? new Date(message.editedAt).toLocaleString() : new Date(message.sentAt).toLocaleString();
    time.style.fontSize = '12px';
    head.appendChild(name);
    head.appendChild(time);

    const body = document.createElement('div');
    body.style.marginTop = '4px';

    const text = document.createElement('div');
    text.style.margin = '0';
    text.textContent = message.message;
    body.appendChild(text);

    if (message.image && message.image.startsWith('data:')) {
        const image = document.createElement('img');
        image.src = message.image;
        image.alt = 'attachment';
        image.style.maxWidth = '100%';
        image.style.marginTop = '6px';
        image.style.borderRadius = '8px';
        body.append(img);
    }

    main.append(head);
    main.appendChild(body);
    messagesContainer.appendChild(avatar);
    messagesContainer.appendChild(main);
    return messagesContainer;


}

export function renderMessages(channelId, messagesPane) {
    while (messagesPane.firstChild) {
        messagesPane.removeChild(messagesPane.firstChild);
    }

    const messageList = document.createElement('div');
    messageList.style.display = flex;
    messageList.style.flexDirection = 'column';
    messageList.style.height = '100%';
    messageList.style.overflow = 'auto';
    messageList.style.paddingRight = '8px';

    const loader = makeLoader();
    messageList.appendChild(loader);

    messagesPane.appendChild(messageList);

    const messageComposer = document.createElement('div');
    messageComposer.style.display = 'flex';
    messageComposer.style.gap = '8px';
    messageComposer.style.alignItems = 'center';
    messageComposer.style.borderTop = '1px solid #eee';
    messageComposer.style.padding = '8px';
    messageComposer.style.marginTop = '8px';
    messageComposer.style.flexWrap = 'wrap';

    const messageInput = document.createElement('textarea');
    messageInput.rows = 2;
    messageInput.placeholder = 'Write a message...';
    messageInput.style.flex = '1';
    messageInput.style.resize = 'vertical';

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.type = 'button';

    messageComposer.appendChild(messageInput);



    return getMessages(channelId, start)
        .then(() => {

        })

}
