import { BACKEND_PORT } from '../config.js';

const API_BASE = `http://localhost:${BACKEND_PORT}`;
export function renderLogin({ mount, go }) {

    const loginTitle = document.createElement('h2');
    loginTitle.innerText = 'Login';

    const emailLabel = document.createElement('label');
    emailLabel.innerText = 'Email';
    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.id = 'login-user'
    
    mount.innerHTML = `
    <h2>Login</h2>
    Email: <input type="text" id="login-user" />
    Password: <input type="password" id="login-password" />
    <button id="login-button">Login</button>
    `
    mount.querySelector('#login-button').addEventListener('click', () => {
        const email = mount.querySelector('#login-user').value;
        const password = mount.querySelector('#login-password').value;
    });
    validateLogin(email, password, mount, go)
};

const validateLogin = (email, password, mount, go) => {
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
        .then((res) => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Login failed');
            localStorage.setItem('slackr_token', data.token);
            go('home');
        })
        .catch(err => {
            mount.querySelector('#error').textContent = err.message;
        });
};