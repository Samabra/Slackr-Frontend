import { API_BASE } from '../config.js';
import { showError } from '../errorPopup.js';

export function renderRegistration({ mount, go }) {

    const registerTitle = document.createElement('h2');
    registerTitle.innerText = 'Sign Up';

    const registerEmailLabel = document.createElement('label');
    registerEmailLabel.innerText = 'Email:';

    const registerEmailInput = document.createElement('input');
    registerEmailInput.type = 'text';
    registerEmailInput.id = 'register-email';

    const registerNameLabel = document.createElement('label');
    registerNameLabel.innerText = 'Name:';

    const registerNameInput = document.createElement('input');
    registerNameInput.type = 'text';
    registerNameInput.id = 'register-name';

    const registerPasswordLabel = document.createElement('label');
    registerPasswordLabel.innerText = 'Password:';

    const registerPasswordInput = document.createElement('input');
    registerPasswordInput.type = 'password';
    registerPasswordInput.id = 'register-password';

    const registerPasswordConfirmLabel = document.createElement('label');
    registerPasswordConfirmLabel.innerText = 'Confirm Password:';

    const registerPasswordConfirm = document.createElement('input');
    registerPasswordConfirm.type = 'password';
    registerPasswordConfirm.id = 'register-password-confirm';

    const registerButton = document.createElement('button');
    registerButton.innerText = 'Sign Up Now';
    registerButton.id = 'register-submit';

    const errorMsg = document.createElement('p');
    errorMsg.id = 'error';
    errorMsg.style.color = 'red';
    
    mount.appendChild(registerTitle);
    mount.appendChild(registerEmailLabel);
    mount.appendChild(registerEmailInput);
    mount.appendChild(document.createElement('br'));
    mount.appendChild(registerNameLabel);
    mount.appendChild(registerNameInput);
    mount.appendChild(document.createElement('br'));
    mount.appendChild(registerPasswordLabel);
    mount.appendChild(registerPasswordInput);
    mount.appendChild(document.createElement('br'));
    mount.appendChild(registerPasswordConfirmLabel);
    mount.appendChild(registerPasswordConfirm);
    mount.appendChild(document.createElement('br'));
    mount.appendChild(registerButton);
    mount.appendChild(document.createElement('br'));
    mount.appendChild(errorMsg);
    registerButton.addEventListener('click', () => {
        const email = registerEmailInput.value.trim();
        const name = registerNameInput.value.trim();
        const password = registerPasswordInput.value.trim();
        const passwordConfirm = registerPasswordConfirm.value.trim();

        if (!email || !name || !password || !passwordConfirm) {
            showError('Please enter all fields to register');
            return;
        } else if (password !== passwordConfirm) {
            showError('Passwords are not the same');
            return;
        }
        register(email, name, password, mount, go);
    });
}


const register = (email, name, password, mount, go) => {
    fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            name: name,
            password: password,
        })
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data})))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Registration has failed');
            }
            localStorage.setItem('token', data.token);
            go('home');
        })
        .catch(err => {
            console.error(err);
            showError(err.message || 'Something went wrong during registration');
        });

};