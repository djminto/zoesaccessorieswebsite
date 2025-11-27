// Auth.js - LocalStorage-based authentication system (from Minto Portfolio)

// Switch between login and register
function switchToRegister() {
    document.getElementById('loginCard').classList.add('hidden');
    document.getElementById('registerCard').classList.remove('hidden');
}

function switchToLogin() {
    document.getElementById('registerCard').classList.add('hidden');
    document.getElementById('loginCard').classList.remove('hidden');
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password strength checker
if (document.getElementById('registerPassword')) {
    document.getElementById('registerPassword').addEventListener('input', function(e) {
        const password = e.target.value;
        const strengthBar = document.getElementById('passwordStrength');
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        strengthBar.className = 'password-strength';
        if (strength <= 1) {
            strengthBar.classList.add('weak');
        } else if (strength <= 3) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    });
}

// Login Form Handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Optionally show welcome modal here
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });
}

// Registration Form Handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            alert('Email already registered. Please login or use a different email.');
            return;
        }
        const newUser = {
            id: 'USER-' + Date.now(),
            firstName,
            lastName,
            email,
            phone,
            password,
            role: 'customer',
            createdAt: new Date().toISOString(),
            profileImage: ''
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}

// Demo Login
function loginAsDemo() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let demoUser = users.find(u => u.email === 'demo@example.com');
    if (!demoUser) {
        demoUser = {
            id: 'USER-DEMO',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@example.com',
            phone: '876-123-4567',
            password: 'demo123',
            role: 'customer',
            createdAt: new Date().toISOString(),
            profileImage: ''
        };
        users.push(demoUser);
        localStorage.setItem('users', JSON.stringify(users));
    }
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Initialize admin account if not exists
(function initializeAdmin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.find(u => u.email === 'danielminto13@gmail.com')) {
        const adminUser = {
            id: 'USER-ADMIN',
            firstName: 'Daniel',
            lastName: 'Minto',
            email: 'danielminto13@gmail.com',
            phone: '876-341-6014',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString(),
            profileImage: ''
        };
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
    }
})();
