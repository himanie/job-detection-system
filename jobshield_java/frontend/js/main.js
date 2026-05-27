// ========================================
// JobShield.AI - Main JavaScript
// ========================================

const API_BASE_URL = 'http://localhost:8080/api';

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Get user ID from localStorage
function getUserId() {
    return localStorage.getItem('userId');
}

// Set auth token
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Set user ID
function setUserId(userId) {
    localStorage.setItem('userId', userId);
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Logout user
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.location.href = 'home.html';
}

// Make API request
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-User-ID': getUserId() || '',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (response.status === 401) {
            logout();
            return null;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        showNotification('Error: ' + error.message, 'error');
        return null;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Redirect to login if not authenticated (for protected pages)
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate URL
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add any global initialization here
});

function showPage(pageId){

    // sab pages hide karo
    let sections = document.querySelectorAll("section");
    sections.forEach(sec => sec.style.display = "none");

    // selected page show karo
    let page = document.getElementById(pageId);
    if(page){
        page.style.display = "block";
    }
}



