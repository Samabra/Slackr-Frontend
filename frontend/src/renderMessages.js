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

function buildMessage(message) {
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'message-container';
    messagesContainer.style.display = 'flex';
    messagesContainer.style.gap = '10px';
    messagesContainer.style.padding = '8px 0';
    messagesContainer.style.borderBottom = '1px solid #eee';

    const avatar = document.createElement('img');
    avatar.alt = 'avatar';
    avatar.width = '36px';
    avatar.height = '36px';
    avatar.style.borderRadius = '50%';

    const fallback = 
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxOCIgY3k9IjEzIiByPSI4IiBmaWxsPSIjZGRkIi8+PHBhdGggZD0iTTkgMjkuNWMwLTQuNCAzLjYtOC41IDktOC41czkgNC4xIDkgOC41IiBmaWxsPSIjZGRkIi8+PC9zdmc+';
    
    const main = document.createElement('div');
    main.style.flex = '1';

    const head = document.createElement('div');
    head.style.display = 'flex';
    head.style.gap = '8px';
    head.style.alignItems = 'baseline';

    const name = document.createElement('strong');

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

    getUser(message.sender)
        .then(user => {
            name.textContent = user.name;
            avatar.src = (user.image && user.image.startsWith('data:')) ? user.image : fallback;
        })
        .catch(() => {
            name.textContent = 'Unknown user';
            avatar.src = fallback;
        })
    return messagesContainer;


}

export function renderMessages(channelId, messagesPane) {
    while (messagesPane.firstChild) {
        messagesPane.removeChild(messagesPane.firstChild);
    }

    const messageList = document.createElement('div');
    messageList.style.display = 'flex';
    messageList.style.flexDirection = 'column';
    messageList.style.height = '100%';
    messageList.style.overflowY = 'auto';
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

    const attachButton = document.createElement('button');
    attachButton.textContent = '+';
    attachButton.title = 'Attach Image';
    attachButton.style.width = '36px';
    attachButton.style.height = '36px';
    attachButton.style.borderRadius = '50%';
    attachButton.style.background = '#e3e3e3';
    attachButton.style.border = 'none';
    attachButton.style.cursor = 'pointer';

    const messageInput = document.createElement('textarea');
    messageInput.rows = 2;
    messageInput.placeholder = 'Write a message...';
    messageInput.style.flex = '1';
    messageInput.style.resize = 'vertical';
    messageInput.style.padding = '6px';

    const sendButton = document.createElement('button');
    sendButton.type = 'button';
    sendButton.textContent = 'Send';
    sendButton.title = 'Send message';
    sendButton.style.width = '40px';
    sendButton.style.height = '40px';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '50%';
    sendButton.style.background = '#007a5a';
    sendButton.style.cursor = 'pointer';
    sendButton.style.display = 'flex';
    sendButton.style.alignItems = 'center';
    sendButton.style.justifyContent = 'center';


    const sendSVG = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(sendSVG, 'svg');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'white');
    const path = document.createElementNS(sendSVG, 'path');
    path.setAttribute('d', 'M2 21l21-9L2 3v7l15 2-15 2z');
    svg.appendChild(path);
    sendButton.appendChild(svg);

    messageComposer.appendChild(attachButton);
    messageComposer.appendChild(messageInput);
    messageComposer.appendChild(sendButton);
    messagesPane.appendChild(messageList);
    messagesPane.appendChild(messageComposer);



    let start = 0;

    let isLoadingOlder = false;
    let allMessagesLoaded = false;
    getMessages(channelId, start)
        .then(({ messages }) => {
            if (loader.parentNode === messageList) {
                messageList.removeChild(loader);
            }
            messages.forEach(message => {
                const messageElement = buildMessage(message);
                messageList.appendChild(messageElement);
            });
            messageList.scrollTop = messageList.scrollHeight;
        })
        .catch(err => {
            showError(err.message || 'Failed to load messages');
        });
    
    messageList.addEventListener('scroll', () => {
        if (messageList.scrollTop > 0 || isLoadingOlder || allMessagesLoaded) {
            return;
        }
        isLoadingOlder = true;
        start += 25;

        const oldScrollHeight = messageList.scrollHeight;

        getMessages(channelId, start)
            .then(({ messages }) => {
                if (!messages.length) {
                    allMessagesLoaded = true;
                    return;
                }
                const firstMessage = messageList.firstChild;
                messages.reverse().forEach(message => {
                    const messageElement = buildMessage(message);
                    messageList.appendChild(messageElement);
                });

                messageList.scrollTop = messageList.scrollHeight - oldScrollHeight;
            })
            .catch(err => {
                showError(err.message || 'Failed to load older messages')
            })
            .finally(() => (isLoadingOlder = false));
    });

}
