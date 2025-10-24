import { BACKEND_PORT } from '../config.js';

const API_BASE = `http://localhost:${BACKEND_PORT}`;
export function renderLogin({ mount, go }) {
    console.log('I am at renderLogin');
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

    const errorMsg = document.createElement('p');
    errorMsg.id = 'error';
    errorMsg.style.color = 'red';

    mount.appendChild(loginTitle);
    mount.appendChild(emailLabel);
    mount.appendChild(emailInput);
    mount.appendChild(document.createElement('br'));
    mount.appendChild(passwordLabel);
    mount.appendChild(passwordInput);
    mount.appendChild(document.createElement('br'));
    mount.appendChild(loginButton);
    mount.appendChild(errorMsg);

    loginButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            errorMsg.innerText = 'Email or password required.';
            return;
        }
        errorMsg.innerText = '';
        validateLogin(email, password, mount, go)
    });
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
        .then((res) => res.text())
        .then((data) => {
            const decoded = JSON.parse(data);
            localStorage.setItem('token', decoded.token);
            go('home');
        })
        .catch((err) => {
            const p = mount.querySelector('#error');
            if (p) {
                p.innerText = err.message || 'Login Failed'
            }
        });
};