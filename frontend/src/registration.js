import { BACKEND_PORT } from './config.js';

const API_BASE = `http://localhost:${BACKEND_PORT}`;

const registerEmail = (email, name, password) => {
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
        .then((res) => res.text())
        .then((data) => {
            console.log('data', JSON.parse(data));
            localStorage.setItem('token', token)
        })
};



document.getElementById('register-submit').addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const name = document.getElementById('register-name').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    if (password !== passwordConfirm) {
        alert('Passwords are not the same!');
    } else {
        console.log('fields', email, name, password, passwordConfirm)
    }
});