import { BACKEND_PORT } from './config.js';

const API_BASE = `http://localhost:${BACKEND_PORT}`;
document.getElementById('login-button').addEventListener('click', () => {
    const email = document.getElementById('login-user').value;
    const password = document.getElementById('login-password').value;
});

const validateLogin = (username, password) => {
    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    })
        .then((res) => res)
} 