import { API_BASE } from "../config.js";
import { getUserProfile, updateUserProfile } from "../helpers.js";


export function renderProfile({mount, go}) {

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.style.padding = '24px';
    mount.appendChild(container);

    const title = document.createElement('h2');
    title.textContent = 'Your Profile';
    container.appendChild(title);

    const status = document.createElement('div');
    status.style.fontSize = '13px';
    status.style.color = '#666';
    container.appendChild(status);

    const form = document.createElement('div');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '10px';
    container.appendChild(form);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Name';
    form.appendChild(nameInput);

    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.placeholder = 'Email';
    emailInput.disabled = true;
    form.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'New Password (optional)';
    form.appendChild(passwordInput);

    const bioInput = document.createElement('textarea');
    bioInput.placeholder = 'Your bio';
    form.appendChild(bioInput);

    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    form.appendChild(imageInput);

}

