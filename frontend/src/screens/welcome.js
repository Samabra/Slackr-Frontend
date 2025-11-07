export function renderWelcome({ mount, go }) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.height = '100vh';
    container.style.gap = '16px';
  
    const heading = document.createElement('h1');
    heading.textContent = 'Welcome to Slackr!';
  
    const subText = document.createElement('p');
    subText.textContent = 'Please sign up or log in to continue.';
  
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.gap = '12px';
  
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Log In';
    loginButton.style.padding = '10px 20px';
    loginButton.style.cursor = 'pointer';
    loginButton.addEventListener('click', () => go('login'));
  
    const registerButton = document.createElement('button');
    registerButton.textContent = 'Sign Up';
    registerButton.style.padding = '10px 20px';
    registerButton.style.cursor = 'pointer';
    registerButton.addEventListener('click', () => go('register'));
  
    buttonGroup.appendChild(loginButton);
    buttonGroup.appendChild(registerButton);
  
    container.appendChild(heading);
    container.appendChild(subText);
    container.appendChild(buttonGroup);
  
    mount.appendChild(container);
  }