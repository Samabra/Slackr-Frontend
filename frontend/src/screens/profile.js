import { API_BASE } from "../config.js";
import { fileToDataUrl, getUserProfile, updateUserProfile } from "../helpers.js";
import { getCurrentUserId } from "../helpers.js";


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
    imageInput.accept = 'image/';
    form.appendChild(imageInput);

    const avatarPreview = document.createElement('img');
    avatarPreview.style.width = '100px';
    avatarPreview.style.height = '100px';
    avatarPreview.style.borderRadius = '50%';
    avatarPreview.style.objectFit = 'cover';
    avatarPreview.style.display = 'none';
    form.appendChild(avatarPreview);

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '8px';
    container.appendChild(btnRow);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Changes';
    saveBtn.type = 'button';
    saveBtn.style.padding = '8px 12px';
    saveBtn.style.background = '#007a5a';
    saveBtn.style.color = '#fff';
    saveBtn.style.border = 'none';
    saveBtn.style.borderRadius = '8px';
    saveBtn.style.cursor = 'pointer';
    btnRow.appendChild(saveBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.type = 'button';
    cancelBtn.style.padding = '8px 12px';
    cancelBtn.style.border = '1px solid #ccc';
    cancelBtn.style.borderRadius = '8px';
    cancelBtn.style.background = '#fff';
    cancelBtn.style.cursor = 'pointer';
    btnRow.appendChild(cancelBtn);

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back';
    backBtn.type = 'button';
    backBtn.style.padding = '8px 12px';
    backBtn.style.border = '1px solid #ddd';
    backBtn.style.borderRadius = '8px';
    backBtn.style.background = '#fff';
    backBtn.style.cursor = 'pointer';
    backBtn.addEventListener('click', () => go('home'));
    btnRow.appendChild(backBtn);

    status.textContent = 'Loading profile...';

    getUserProfile(getCurrentUserId())
        .then(user => {
        nameInput.value = user.name || '';
        emailInput.value = user.email || '';
        bioInput.value = user.bio || '';
        if (user.image) {
            avatarPreview.src = user.image;
            avatarPreview.style.display = 'block';
        }
        status.textContent = '';
        })
        .catch(err => {
            status.textContent = err.message || 'Failed to load profile';
            status.style.color = 'red';
        });

    let imageDataUrl = null;
    imageInput.addEventListener('change', () => {
        const file = imageInput.files && imageInput.files[0];
        if (!file) return;
        fileToDataUrl(file)
        .then(url => {
            imageDataUrl = url;
            avatarPreview.src = url;
            avatarPreview.style.display = 'block';
        })
        .catch(() => {
            status.textContent = 'Failed to load image preview';
        });
    });
    saveBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput.value.trim();
        const bio = bioInput.value.trim();
        const image = imageDataUrl;

        saveBtn.disabled = true;
        status.textContent = 'Saving...';

        updateUserProfile(email, password, name, bio, image)
            .then(() => {
                status.textContent = 'Profile updated!';
                status.style.color = 'green';
                passwordInput.value = '';
            })
            .catch(err => {
                status.textContent = err.message || 'Failed to update profile';
                status.style.color = 'red';
            })
            .finally(() => {
                saveBtn.disabled = false;
            });
    });
    
    cancelBtn.addEventListener('click', () => {
        nameInput.value = '';
        bioInput.value = '';
        passwordInput.value = '';
        imageInput.value = '';
        avatarPreview.style.display = 'none';
        imageDataUrl = null;
    });

}

