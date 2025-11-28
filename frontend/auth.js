const API_URL = 'http://localhost:3333';


function showMessage(message, type = 'error') {

    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }


    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;


    const form = document.querySelector('form');
    form.parentNode.insertBefore(messageDiv, form);


    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}


function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {

        window.location.href = 'dashboard.html';
        return true;
    }
    return false;
}


function saveUserSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}


function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}


document.addEventListener('DOMContentLoaded', function() {

    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
        const isRedirecting = checkAuthStatus();
        
        if (!isRedirecting) {
            const form = document.querySelector('form');
            if (form) {
                form.classList.add('form-slide-in');
            }
        }
    }
});