import { BACKEND_PORT } from '../config.js';

const API_BASE = `http://localhost:${BACKEND_PORT}`;
export function renderLogin({ mount, go }) {

    const loginTitle = document.createElement('h2');
    loginTitle.innerText = 'Login';

    const emailLabel = document.createElement('label');
    emailLabel.innerText = 'Email';

    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.id = 'login-user';

    const passwordLabel = document.createElement('label');
    passwordLabel.innerText = 'Password';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'login-password';

    const loginButton = document.createElement('button');
    loginButton.innerText = 'Login';
    loginButton.id = 'login-button';

    mount.appendChild(loginTitle);
    mount.appendChild(emailLabel);
    mount.appendChild(emailInput);
    mount.appendChild(document.createElement('br'));
    mount.appendChild(passwordLabel);
    mount.appendChild(passwordInput);
    mount.appendChild(document.createElement('br'));
    mount.appendChild(loginButton);

    loginButton.addEventListener('click', () => {
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