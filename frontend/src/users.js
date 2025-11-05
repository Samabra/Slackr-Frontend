import { API_BASE } from "./config.js";
import { showError } from "./errorPopup.js";
import { getChannel } from "./helpers.js";
import { getUserProfile, updateUserProfile } from "./helpers.js";

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
            return Array.isArray(data) ? data : (data.users || []);
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
            userId: userID,
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

export function userProfileOpener(messagesPane) {
    if (!messagesPane || messagesPane.__profileHandlerInstalled) {
        return;
    }
    messagesPane.__profileHandlerInstalled = true;
  
    messagesPane.addEventListener('click', function (e) {
      const t = e.target;
      if (!t) return;
      if (t.classList && t.classList.contains('message-user-name')) {
        const userId = t.dataset.userId;
        if (!userId) return;
        openProfileModal(userId);
      }
    });
}

export function openInviteModal(channelId, options) {
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
    submitButton.id = 'invite-submit-button';
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

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    Object.assign(cancelButton.style, {
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      background: '#fff',
      cursor: 'pointer',
    });
  
    footer.appendChild(submitButton);
    footer.appendChild(cancelButton);

    const status = document.createElement('div');
    status.style.fontSize = '13px';
    status.style.color = '#666';

    modal.appendChild(header);
    modal.appendChild(searchBox);
    modal.appendChild(listWrap);
    modal.appendChild(footer);
    modal.appendChild(status);
    overlay.appendChild(modal);
    host.appendChild(overlay);

    function close() {
        document.removeEventListener('keydown', onKey);
        overlay.remove();
    }
    function onKey(e) {
        if (e.key === 'Escape') close();
    }
    closeButton.addEventListener('click', close);
    cancelButton.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);

    const selected = new Set();
    function updateSubmitState() {
        submitButton.disabled = selected.size === 0;
    }
    function addRow(user) {
        const row = document.createElement('label');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';
        row.style.padding = '6px 4px';
        row.style.borderRadius = '6px';
        row.style.cursor = 'pointer';
    
        row.addEventListener('mouseenter', () => row.style.background = '#f7f7f7');
        row.addEventListener('mouseleave', () => row.style.background = 'transparent');
    
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'invite-member-checkbox';
        cb.value = String(user.id);
    
        const name = document.createElement('span');
        name.className = 'invite-member-name';
        name.textContent = user.name;
    
        cb.addEventListener('change', () => {
          if (cb.checked) selected.add(user.id);
          else selected.delete(user.id);
          updateSubmitState();
        });
    
        row.appendChild(cb);
        row.appendChild(name);
        listWrap.appendChild(row);
    }
    function filterList(term) {
        const rows = listWrap.children;
        const q = (term || '').toLowerCase();
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const nameEl = row.querySelector('.invite-member-name');
          const name = nameEl ? nameEl.textContent.toLowerCase() : '';
          row.style.display = name.includes(q) ? '' : 'none';
        }
    }
    searchBox.addEventListener('input', () => filterList(searchBox.value));
    status.textContent = 'Loading users…';
    let allUsers = [];
    let memberSet = null;

    getChannel(channelId)
        .then(ch => {
            memberSet = new Set(
                (ch.members || []).map(m => typeof m === 'object' ? String(m.id) : String(m))
            );
            return getAllUsers();
        })
        .then(users => {
            allUsers = Array.isArray(users) ? users : [];
            const candidates = allUsers
                .filter(u => !memberSet.has(String(u.id)))
                .sort((a, b) => {
                    const aName = (a.email || '').toLowerCase();
                    const bName = (b.email || '').toLowerCase();
                    return aName.localeCompare(bName);
                });
      
            while (listWrap.firstChild) listWrap.removeChild(listWrap.firstChild);
      
            if (candidates.length === 0) {
                const empty = document.createElement('div');
                empty.textContent = 'Everyone is already in this channel.';
                empty.style.color = '#666';
                empty.style.padding = '8px 2px';
                listWrap.appendChild(empty);
                status.textContent = '';
            } else {
                candidates.forEach(user => addRow({ id: user.id, name: user.email }));
                status.textContent = '';
            }
        })
        .catch(err => {
            status.textContent = 'Failed to load users';
            showError(err.message || 'Failed to load users');
        });
        submitButton.addEventListener('click', () => {
            if (selected.size === 0) return;
        
            const ids = Array.from(selected);
            submitButton.disabled = true;
            status.textContent = 'Sending invites…';
        
            let chain = Promise.resolve();
            ids.forEach(id => {
                chain = chain.then(() => userInvite(channelId, id));
            });
            chain
                .then(() => {
                    if (typeof onSuccess === 'function') onSuccess();
                        setTimeout(close, 300);
                })
                .catch(err => {
                    showError(err.message);
                    submitButton.disabled = false;
                });
        });

}  



function openProfileModal(userId) {
    let host = document.getElementById('profile-container');
    if (!host) {
        host = document.createElement('div');
        host.id = 'profile-container';
        document.body.appendChild(host);
    }
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9999'
    });

    const card = document.createElement('div');
    Object.assign(card.style, {
        width: 'min(520px, 92vw)',
        maxHeight: '80vh',
        overflow: 'auto',
        background: '#fff',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    });

    const head = document.createElement('div');
    head.style.display = 'flex';
    head.style.alignItems = 'center';
    head.style.gap = '8px';

    const title = document.createElement('h3');
    title.textContent = 'User profile';
    title.style.margin = '0';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Close');
    Object.assign(closeBtn.style, {
        marginLeft: 'auto',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        background: '#eee',
        cursor: 'pointer',
        fontSize: '18px',
        lineHeight: '32px'
    });

    head.appendChild(title);
    head.appendChild(closeBtn);
    const img = document.createElement('img');
    img.id = 'profile-image';
    img.alt = 'profile';
    Object.assign(img.style, {
        width: '96px',
        height: '96px',
        borderRadius: '50%',
        objectFit: 'cover',
        alignSelf: 'center'
    });

    const nameRow = document.createElement('div');
    const nameLabel = document.createElement('strong');
    nameLabel.textContent = 'Name: ';
    const nameVal = document.createElement('span');
    nameVal.id = 'profile-name';
    nameRow.appendChild(nameLabel);
    nameRow.appendChild(nameVal);

    const emailRow = document.createElement('div');
    const emailLabel = document.createElement('strong');
    emailLabel.textContent = 'Email: ';
    const emailVal = document.createElement('span');
    emailVal.id = 'profile-email';
    emailRow.appendChild(emailLabel);
    emailRow.appendChild(emailVal);

    const bioRow = document.createElement('div');
    const bioLabel = document.createElement('strong');
    bioLabel.textContent = 'Bio: ';
    const bioVal = document.createElement('span');
    bioVal.id = 'profile-bio';
    bioRow.appendChild(bioLabel);
    bioRow.appendChild(bioVal);

    const status = document.createElement('div');
    status.style.fontSize = '13px';
    status.style.color = '#666';
    status.textContent = 'Loading profile…';

    card.appendChild(head);
    card.appendChild(img);
    card.appendChild(nameRow);
    card.appendChild(emailRow);
    card.appendChild(bioRow);
    card.appendChild(status);

    overlay.appendChild(card);
    host.appendChild(overlay);

    function close() {
        document.removeEventListener('keydown', onKey);
        overlay.remove();
      }
      function onKey(e) { if (e.key === 'Escape') close(); }
    
      closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
      document.addEventListener('keydown', onKey);
    
      getUserProfile(userId)
        .then(function (u) {
          img.src = u && u.image && u.image.startsWith('data:') ? u.image :
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0OCIgY3k9IjM2IiByPSIxNiIgZmlsbD0iI0RERCIvPjxwYXRoIGQ9IkMyNCA3NC4yQzI0IDYzLjg2IDMyLjg2IDU1IDQzLjIgNTVINTIuOEM2My4xNCA1NSA3MiA2My44NiA3MiA3NC4yVjc5SDI0Vjc0LjJaIiBmaWxsPSIjREREIi8+PC9zdmc+';
    
          nameVal.textContent = (u && u.name) ? u.name : '(unknown)';
          emailVal.textContent = (u && u.email) ? u.email : '(unknown)';
          bioVal.textContent = (u && typeof u.bio === 'string' && u.bio.length) ? u.bio : '(no bio)';
          status.textContent = '';
        })
        .catch(function (err) {
          status.textContent = 'Failed to load profile';
          showError((err && err.message) || 'Failed to load profile');
        });
}