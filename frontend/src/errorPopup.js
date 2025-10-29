export function showError(message) {
    const existingError = document.querySelector('.error-body');
    if (existingError) {
        existingError.remove();
    }
    console.log(`There is an error ${message}`);
    const errorPopup = document.createElement('div');
    errorPopup.classList.add('error-body');
    Object.assign(errorPopup.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#ff4b4b',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '220px',
    });

    const errorMessage = document.createElement('span');
    errorMessage.innerText = message;

    const closeError = document.createElement('button');
    closeError.innerText = '✖';
    closeError.id = 'error-close';
    Object.assign(closeError.style, {
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginLeft: 'auto',
    });
    closeError.addEventListener('click', () => {
        errorPopup.remove();
    });
    errorPopup.appendChild(errorMessage);
    errorPopup.appendChild(closeError);
    document.body.appendChild(errorPopup);

}