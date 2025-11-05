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
    

}  
