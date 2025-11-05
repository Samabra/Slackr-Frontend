import { API_BASE } from "./config.js";
import { showError } from "./errorPopup.js";

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

