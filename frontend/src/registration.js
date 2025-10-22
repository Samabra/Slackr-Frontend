import { BACKEND_PORT } from './config.js';


const registerEmail = (email, name, password) => {
    fetch('http://localhost:5005/auth/register', {
        method: 'POST',
        body: {
            email: email,
            name: name,
            password: password,
        }
    });
    console.log(email, name, password);
}



document.getElementbyId('register-submit').addEventListener('click', () => {
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