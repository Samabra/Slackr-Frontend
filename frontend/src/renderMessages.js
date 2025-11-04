import { API_BASE } from "./config.js";
import { showError } from "./errorPopup.js";
import { getUser } from "./helpers.js";
import { fileToDataUrl, makeLoader, getCurrentUserId } from "./helpers.js";

function getMessages(channelId, start) {
    return fetch(`${API_BASE}/message/${channelId}?start=${start}`, {
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
        });
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
        });
}

function deleteMessage(channelId, messageId) {
    return fetch(`${API_BASE}/message/${channelId}/${messageId}`, {
        method: 'DELETE',
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
        });
}

function updateMessages(channelId, messageId, message, image) {
    return fetch(`${API_BASE}/message/${channelId}/${messageId}`, {
        method: 'PUT',
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
        });   
}

function pinMessage(channelId, messageId) {
    return fetch(`${API_BASE}/message/pin/${channelId}/${messageId}`, {
        method: 'POST',
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
        }); 
}

function unpinMessage(channelId, messageId) {
    return fetch(`${API_BASE}/message/unpin/${channelId}/${messageId}`, {
        method: 'POST',
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
        });
}

function reactMessage(channelId, messageId, react) {
    return fetch(`${API_BASE}/message/react/${channelId}/${messageId}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            react: react,
        })
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data})))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to load channel details');
            }
            return data;
        }); 
}
function unReact(channelId, messageId, react) {
    return fetch(`${API_BASE}/message/unreact/${channelId}/${messageId}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            react: react,
        })
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data})))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Failed to load channel details');
            }
            return data;
        });
}

function buildMessage(message, channelId) {

    const currentUserId = getCurrentUserId();
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'message-container';
    messagesContainer.style.display = 'flex';
    messagesContainer.style.gap = '10px';
    messagesContainer.style.padding = '8px 0';
    messagesContainer.style.borderBottom = '1px solid #eee';
    messagesContainer.style.alignItems = 'flex-start';
    messagesContainer.dataset.messageId = String(message.id);

    const avatar = document.createElement('img');
    avatar.alt = 'avatar';
    avatar.width = 36;
    avatar.height = 36;
    avatar.style.borderRadius = '50%';

    const fallback = 
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxOCIgY3k9IjEzIiByPSI4IiBmaWxsPSIjZGRkIi8+PHBhdGggZD0iTTkgMjkuNWMwLTQuNCAzLjYtOC41IDktOC41czkgNC4xIDkgOC41IiBmaWxsPSIjZGRkIi8+PC9zdmc+';
    
    const main = document.createElement('div');
    main.style.flex = '1';
    main.style.minWidth = '0';
    main.style.wordBreak = 'break-word';
    const head = document.createElement('div');
    head.style.display = 'flex';
    head.style.gap = '8px';
    head.style.alignItems = 'center';

    const name = document.createElement('strong');

    const time = document.createElement('span');
    time.style.color = '#666';
    time.textContent = message.edited ? new Date(message.editedAt).toLocaleString() : new Date(message.sentAt).toLocaleString();
    time.style.fontSize = '12px';

    const spacer = document.createElement('div');
    spacer.style.flex = '1';
    head.appendChild(name);
    head.appendChild(time);
    head.append(spacer);

    const ownMessage = Number(currentUserId) === Number(message.sender);
    if (ownMessage) {
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'message-delete-button';
        deleteButton.title = 'Delete message';
        deleteButton.setAttribute('aria-label', 'Delete message');
        deleteButton.style.border = 'none';
        deleteButton.style.background = 'transparent';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.padding = '2px';
        deleteButton.style.opacity = '0.7';
        deleteButton.onmouseenter = () => (deleteButton.style.opacity = '1');
        deleteButton.onmouseleave = () => (deleteButton.style.opacity = '0.7');

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '18');
        svg.setAttribute('height', '18');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        const path = document.createElementNS(svgNS, 'path');

        path.setAttribute('d', 'M3 6h18M8 6l1-2h6l1 2m-1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6m3 4v8m4-8v8');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);
        deleteButton.appendChild(svg);

        deleteButton.addEventListener('click', () => {
            deleteButton.disabled = true;
            deleteMessage(channelId, message.id)
                .then(() => {
                messagesContainer.style.transition = 'opacity 120ms ease';
                messagesContainer.style.opacity = '0';
                setTimeout(() => {
                    messagesContainer.remove();
                }, 130);
                })
                .catch((err) => {
                    console.log('I failed to delete messages');
                    deleteButton.disabled = false;
                    showError(err.message || 'Failed to delete message');
                });
        });

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'message-edit-button';
        editButton.title = 'Edit message';
        editButton.setAttribute('aria-label', 'Edit message');
        editButton.style.border = 'none';
        editButton.style.background = 'transparent';
        editButton.style.cursor = 'pointer';
        editButton.style.padding = '2px';
        editButton.style.opacity = '0.7';
        editButton.onmouseenter = () => (editButton.style.opacity = '1');
        editButton.onmouseleave = () => (editButton.style.opacity = '0.7');

        const svgNew = 'http://www.w3.org/2000/svg';
        const editSVG = document.createElementNS(svgNew, 'svg');
        editSVG.setAttribute('width', '18');
        editSVG.setAttribute('height', '18');
        editSVG.setAttribute('viewBox', '0 0 24 24');
        editSVG.setAttribute('fill', 'none');
        const editPath = document.createElementNS(svgNew, 'path');
        editPath.setAttribute('d', 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z');
        editPath.setAttribute('stroke', 'currentColor');
        editPath.setAttribute('stroke-width', '2');
        editPath.setAttribute('stroke-linecap', 'round');
        editPath.setAttribute('stroke-linejoin', 'round');
        editSVG.appendChild(editPath);
        editButton.appendChild(editSVG);
        
        head.appendChild(editButton);
        head.appendChild(deleteButton);
    }

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
        body.append(image);
    }
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';

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
    const currentUserId = getCurrentUserId();
    const messageList = document.createElement('div');
    messageList.style.display = 'flex';
    messageList.style.flexDirection = 'column';
    messageList.style.height = '100%';
    messageList.style.overflowY = 'auto';
    messageList.style.paddingRight = '8px';
    messageList.style.flex = '1';

    const messageComposer = document.createElement('div');
    messageComposer.style.display = 'flex';
    messageComposer.style.gap = '8px';
    messageComposer.style.alignItems = 'center';
    messageComposer.style.borderTop = '1px solid #eee';
    messageComposer.style.padding = '8px';
    messageComposer.style.marginTop = '8px';
    messageComposer.style.flexWrap = 'wrap';
    messageComposer.style.flexShrink = '0';

    const attachButton = document.createElement('button');
    attachButton.textContent = '+';
    attachButton.title = 'Attach Image';
    attachButton.style.width = '36px';
    attachButton.style.height = '36px';
    attachButton.style.borderRadius = '50%';
    attachButton.style.background = '#e3e3e3';
    attachButton.style.border = 'none';
    attachButton.style.cursor = 'pointer';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png, image/jpeg, image/jpg';
    fileInput.style.display = 'none';

    const inputColumns = document.createElement('div');
    inputColumns.style.display = 'flex';
    inputColumns.style.flexDirection = 'column';
    inputColumns.style.flex = '1';
    inputColumns.style.gap = '6px';

    const messageInput = document.createElement('textarea');
    messageInput.rows = 2;
    messageInput.placeholder = 'Write a message...';
    messageInput.style.flex = '1';
    messageInput.style.resize = 'vertical';
    messageInput.style.padding = '6px';
    messageInput.id = 'message-input';

    const thumbPreview = document.createElement('div');
    thumbPreview.style.display = 'flex';
    thumbPreview.style.alignItems = 'flex-start';
    thumbPreview.style.gap = '8px';
    thumbPreview.style.minHeight = '0';
    thumbPreview.style.flexWrap = 'wrap';
    thumbPreview.style.padding = '2px 0';

    inputColumns.appendChild(messageInput);
    inputColumns.appendChild(thumbPreview);

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
    sendButton.id = 'message-send-button';

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
    messageComposer.appendChild(inputColumns);
    messageComposer.appendChild(sendButton);
    messageComposer.appendChild(fileInput);
    messagesPane.appendChild(messageList);
    messagesPane.appendChild(messageComposer);



    let start = 0;

    let isLoadingOlder = false;
    let allMessagesLoaded = false;
    let topLoaderElement = null;


    function showTopLoader() {
        if (!topLoaderElement) {
            topLoaderElement = makeLoader();
            topLoaderElement.style.padding = '8px';
            topLoaderElement.style.alignSelf = 'center';
            topLoaderElement.dataset.role = 'top-loader';
            messageList.insertBefore(topLoaderElement, messageList.firstChild);
        }
    }

    function removeTopLoader() {
        if (topLoaderElement && topLoaderElement.parentNode) {
            topLoaderElement.parentNode.removeChild(topLoaderElement);
        }
        topLoaderElement = null;
    }

    const initialLoader = makeLoader();
    initialLoader.style.alignSelf = 'center';
    messageList.appendChild(initialLoader);


    
    getMessages(channelId, start)
        .then(({ messages }) => {
            if (initialLoader.parentNode === messageList) {
                messageList.removeChild(initialLoader);
            }
            const fragment = document.createDocumentFragment();
            for (let i = messages.length - 1; i >= 0; i--) {
                fragment.appendChild(buildMessage(messages[i], channelId));
            }
            messageList.appendChild(fragment);
            start = messages.length;
            messageList.scrollTop = messageList.scrollHeight;
        })
        .catch(err => {
            messageList.removeChild(initialLoader);
            showError(err.message || 'Failed to load messages');
        });
    function loadOlder() {
        if (isLoadingOlder || allMessagesLoaded) {
            return;
        }
        showTopLoader();
        isLoadingOlder = true;
    
        const oldScrollHeight = messageList.scrollHeight;
    
        getMessages(channelId, start)
            .then(({ messages }) => {
                if (!messages.length) {
                    allMessagesLoaded = true;
                    return;
                }
                removeTopLoader();

                const fragment = document.createDocumentFragment();
                for (let i = messages.length - 1; i >= 0; i--) {
                    fragment.appendChild(buildMessage(messages[i], channelId));
                }
                messageList.insertBefore(fragment, messageList.firstChild);

                start += messages.length;
                messageList.scrollTop = messageList.scrollHeight - oldScrollHeight;
            })
            .catch(err => {
                showError(err.message || 'Failed to load older messages')
            })
            .finally(() => {
                isLoadingOlder = false;
                removeTopLoader();
            });
    
    }
    messageList.addEventListener('scroll', () => {
        if (messageList.scrollTop <= 100 && !isLoadingOlder && !allMessagesLoaded) {
            loadOlder();
        }
    });

    let thumbnail = null;
    let fileUrl = null;

    attachButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

        if (thumbnail) {
            thumbnail.remove();
            thumbnail = null;
        }

        if (!file) {
            return;
        }
        fileToDataUrl(file)
            .then((dataUrl) => {
                const previewArea = document.createElement('div');
                previewArea.style.display = 'flex';
                previewArea.style.alignItems = 'center';
                previewArea.style.gap = '8px';
                previewArea.style.background = '#f2f2f2';
                previewArea.style.border = '1px solid #e5e5e5';
                previewArea.style.borderRadius = '12px';
                previewArea.style.padding = '4px 8px';

                const imagePreview = document.createElement('img');
                imagePreview.src = dataUrl;
                imagePreview.alt = 'attachment';
                imagePreview.style.width = '36px';
                imagePreview.style.height = '36px';
                imagePreview.style.objectFit = 'cover';
                imagePreview.style.borderRadius = '6px';

                const imageName = document.createElement('span');
                imageName.textContent = file.name;
                imageName.style.fontSize = '12px';
                imageName.style.maxWidth = '160px';
                imageName.style.whiteSpace = 'nowrap';
                imageName.style.overflow = 'hidden';
                imageName.style.textOverflow = 'ellipsis';

                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.textContent = '×';
                removeButton.style.border = 'none';
                removeButton.style.background = 'transparent';
                removeButton.style.cursor = 'pointer';

                previewArea.appendChild(imagePreview);
                previewArea.appendChild(imageName);
                previewArea.appendChild(removeButton);
                thumbPreview.appendChild(previewArea);
                thumbnail = previewArea;
                fileUrl = dataUrl;
                removeButton.addEventListener('click', () => {
                    fileInput.value = '';
                    previewArea.remove();
                    thumbnail = null;
                    fileUrl = null;
                });
            });
    });
    sendButton.addEventListener('click', () => {
        const message = (messageInput.value || '').trim();

        if(!message && !fileUrl) {
            showError('You need to type a message or send an image');
            return;
        }

        sendButton.disabled = true;
        sendMessages(channelId, message, fileUrl || '')
            .then(() => {
                messageInput.value = '';
                fileInput.value = '';
                if (thumbnail) {
                    thumbnail.remove();
                }
                fileUrl = null;
                const start = 0;
                return getMessages(channelId, start);
            })
            .then(({ messages }) => {
                while (messageList.firstChild) {
                    messageList.removeChild(messageList.firstChild);
                }
                const fragment = document.createDocumentFragment();
                for (let i = messages.length - 1; i >= 0; i--) {
                    fragment.appendChild(buildMessage(messages[i], channelId));
                }
                messageList.scrollTop = messageList.scrollHeight; 
            })
            .catch(err => {
                console.log('There is an error with sending messages');
                showError(err.message || 'Failed to send message');
            })
            .finally(() => {
                sendButton.disabled = false;
            })
    });
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

}