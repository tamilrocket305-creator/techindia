// Admin credentials (in production, this should be server-side)
const ADMIN_CREDENTIALS = {
    email: 'techindia2026@gmail.com',
    password: 'techindia',
    name: 'Admin'
};

// Initialize users in localStorage
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        // Add admin user
        const users = [{
            id: 1,
            name: ADMIN_CREDENTIALS.name,
            email: ADMIN_CREDENTIALS.email,
            password: ADMIN_CREDENTIALS.password,
            mobile: '9940584023',
            role: 'admin',
            isAdmin: true,
            createdAt: new Date().toISOString()
        }];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Check if current user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin' && user.email === 'techindia2026@gmail.com';
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Check admin credentials first
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
            id: 1,
            name: ADMIN_CREDENTIALS.name,
            email: ADMIN_CREDENTIALS.email,
            role: 'admin',
            isAdmin: true
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        window.location.href = 'admin/dashboard.html';
        return;
    }
    
    // Check regular users
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const mobile = document.getElementById('registerMobile').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Check if email already exists
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        alert('An account with this email already exists!');
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        mobile,
        password,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Account created successfully! Please login.');
    
    // Switch to login tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="login"]').classList.add('active');
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('loginForm').classList.add('active');
    
    // Clear register form
    document.getElementById('registerForm').reset();
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

// Tab switching
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            document.getElementById(tab + 'Form').classList.add('active');
        });
    });
    
    // Handle auth links
    document.querySelectorAll('.auth-link a[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
            
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            document.getElementById(tab + 'Form').classList.add('active');
        });
    });
}

// Protect admin pages
function protectAdminPage() {
    if (!isLoggedIn() || !isAdmin()) {
        window.location.href = '../login.html';
        return false;
    }
    return true;
}

// Initialize auth
document.addEventListener('DOMContentLoaded', () => {
    initializeUsers();
    setupTabs();
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});
