import { API_BASE } from "./config.js";
import { showError } from "./errorPopup.js";
import { getChannel } from "./helpers.js";

function getAllUsers() {
    return fetch(`${API_BASE}/user`, {
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


function userInvite(channelId, userID) {
    return fetch(`${API_BASE}/channel/${channelId}/invite`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            userId: userId,
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


function getUserProfile(userId) {
    return fetch(`${API_BASE}/channel/${channelId}/invite`, {
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


function updateUserProfile(email, password, name, bio, image) {
    return fetch(`${API_BASE}/channel/${channelId}/invite`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            email: email,
            password: password,
            name: name,
            bio: bio,
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

function openInviteModal(channelId, options) {
    const onSuccess = options && options.onSuccess;
  
    let host = document.getElementById('channel-invite-container');
    if (!host) {
      host = document.createElement('div');
      host.id = 'channel-invite-container';
      document.body.appendChild(host);
    }
  
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '9999',
    });
  
    const modal = document.createElement('div');
    Object.assign(modal.style, {
      width: 'min(520px, 92vw)',
      maxHeight: '80vh',
      overflow: 'auto',
      background: '#fff',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    });
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '8px';

    const title = document.createElement('h3');
    title.textContent = 'Invite users to channel';
    title.style.margin = '0';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.textContent = '×';
    Object.assign(closeButton.style, {
        marginLeft: 'auto',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        background: '#eee',
        cursor: 'pointer',
        fontSize: '18px',
        lineHeight: '32px',
    });

    header.appendChild(title);
    header.appendChild(closeButton);
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search users by name…';
    Object.assign(searchBox.style, {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '8px',
    });

    const listWrap = document.createElement('div');
    Object.assign(listWrap.style, {
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '8px',
        maxHeight: '46vh',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    });

    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.alignItems = 'center';
    footer.style.gap = '8px';

    const submitButton = document.createElement('button');
    submitButton.id = 'invite-submit-button'; // required by spec
    submitButton.type = 'button';
    submitButton.textContent = 'Invite selected';
    Object.assign(submitButton.style, {
        padding: '8px 12px',
        border: 'none',
        borderRadius: '8px',
        background: '#007a5a',
        color: '#fff',
        cursor: 'pointer',
    });
    submitButton.disabled = true;

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    Object.assign(cancelBtn.style, {
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      background: '#fff',
      cursor: 'pointer',
    });
  
    footer.appendChild(submitBtn);
    footer.appendChild(cancelBtn);

    const status = document.createElement('div');
    status.style.fontSize = '13px';
    status.style.color = '#666';

}  
