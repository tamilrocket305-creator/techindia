// Admin Panel JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    protectAdminPage();
    initializeProjects();
    
    // Update admin name
    const user = getCurrentUser();
    if (user) {
        const adminNameEl = document.getElementById('adminName');
        if (adminNameEl) {
            adminNameEl.textContent = user.name;
        }
    }
    
    // Setup logout
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Page-specific initialization
    const path = window.location.pathname;
    
    if (path.includes('dashboard.html')) {
        loadDashboard();
    } else if (path.includes('projects.html')) {
        loadProjectsPage();
    } else if (path.includes('orders.html')) {
        loadOrdersPage();
    }
});

// Dashboard functions
function loadDashboard() {
    const projects = getProjects();
    const orders = getOrders();
    
    // Update stats
    document.getElementById('totalProjects').textContent = projects.filter(p => p.status === 'active').length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('pendingOrders').textContent = orders.filter(o => o.status === 'pending').length;
    document.getElementById('completedOrders').textContent = orders.filter(o => o.status === 'completed').length;
    
    // Load recent orders
    const recentOrders = orders.slice(-10).reverse();
    const tbody = document.getElementById('recentOrdersTable');
    
    if (tbody) {
        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.name}</td>
                <td>${order.projectTitle}</td>
                <td>${order.mobile}</td>
                <td><span class="status ${order.status}">${formatStatus(order.status)}</span></td>
                <td>${order.orderDate}</td>
            </tr>
        `).join('');
    }
}

// Projects page functions
function loadProjectsPage() {
    renderProjectsTable();
    setupProjectModal();
}

function renderProjectsTable() {
    const projects = getProjects();
    const tbody = document.getElementById('projectsTable');
    
    if (tbody) {
        tbody.innerHTML = projects.map(project => `
            <tr>
                <td>${project.id}</td>
                <td>${project.title}</td>
                <td>${getCategoryName(project.category)}</td>
                <td>${getDepartmentName(project.department)}</td>
                <td><span class="status ${project.status}">${project.status}</span></td>
                <td>
                    <button class="btn-edit" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function setupProjectModal() {
    const modal = document.getElementById('projectModal');
    const addBtn = document.getElementById('addProjectBtn');
    const form = document.getElementById('projectForm');
    const cancelBtn = document.getElementById('cancelProject');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Add New Project';
            form.reset();
            document.getElementById('projectId').value = '';
            modal.classList.add('active');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', handleProjectSubmit);
    }
}

function editProject(id) {
    const projects = getProjects();
    const project = projects.find(p => p.id === id);
    
    if (!project) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectCategory').value = project.category;
    document.getElementById('projectDepartment').value = project.department;
    document.getElementById('projectStatus').value = project.status;
    document.getElementById('projectShortDesc').value = project.shortDesc;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectFeatures').value = project.features ? project.features.join(', ') : '';
    document.getElementById('projectPrice').value = project.price || '';
    
    document.getElementById('projectModal').classList.add('active');
}

function handleProjectSubmit(e) {
    e.preventDefault();
    
    const projects = getProjects();
    const id = document.getElementById('projectId').value;
    
    const projectData = {
        title: document.getElementById('projectTitle').value,
        category: document.getElementById('projectCategory').value,
        department: document.getElementById('projectDepartment').value,
        status: document.getElementById('projectStatus').value,
        shortDesc: document.getElementById('projectShortDesc').value,
        description: document.getElementById('projectDescription').value,
        features: document.getElementById('projectFeatures').value.split(',').map(f => f.trim()).filter(f => f),
        price: document.getElementById('projectPrice').value
    };
    
    if (id) {
        // Update existing project
        const index = projects.findIndex(p => p.id == id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...projectData };
        }
    } else {
        // Add new project
        const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        projects.push({ id: newId, ...projectData });
    }
    
    localStorage.setItem('projects', JSON.stringify(projects));
    
    document.getElementById('projectModal').classList.remove('active');
    renderProjectsTable();
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        const projects = getProjects();
        const filtered = projects.filter(p => p.id !== id);
        localStorage.setItem('projects', JSON.stringify(filtered));
        renderProjectsTable();
    }
}

// Orders page functions
function loadOrdersPage() {
    renderOrdersTable();
    setupOrdersModal();
    setupStatusFilter();
}

function renderOrdersTable(filter = 'all') {
    const orders = getOrders();
    const tbody = document.getElementById('ordersTable');
    
    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(o => o.status === filter);
    
    if (tbody) {
        tbody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.name}</td>
                <td>${order.projectTitle}</td>
                <td>${order.mobile}</td>
                <td>${order.orderCode}</td>
                <td><span class="status ${order.status}">${formatStatus(order.status)}</span></td>
                <td>${order.orderDate}</td>
                <td>
                    <button class="btn-view" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function setupOrdersModal() {
    const modal = document.getElementById('orderModal');
    const closeBtn = modal.querySelector('.close-modal');
    const closeBtn2 = modal.querySelector('.close-modal-btn');
    const updateBtn = document.getElementById('updateOrderBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    
    if (closeBtn2) {
        closeBtn2.addEventListener('click', () => modal.classList.remove('active'));
    }
    
    if (updateBtn) {
        updateBtn.addEventListener('click', updateOrderStatus);
    }
}

function viewOrder(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    document.getElementById('detailOrderId').textContent = order.id;
    document.getElementById('detailOrderCode').textContent = order.orderCode;
    document.getElementById('detailOrderDate').textContent = order.orderDate;
    document.getElementById('detailName').textContent = order.name;
    document.getElementById('detailMobile').textContent = order.mobile;
    document.getElementById('detailEmail').textContent = order.email;
    document.getElementById('detailAddress').textContent = order.address;
    document.getElementById('detailPincode').textContent = order.pincode;
    document.getElementById('detailProject').textContent = order.projectTitle;
    
    document.getElementById('updateOrderId').value = order.id;
    document.getElementById('updateStatus').value = order.status;
    document.getElementById('updateNote').value = order.statusNote || '';
    
    document.getElementById('orderModal').classList.add('active');
}

function updateOrderStatus() {
    const orderId = document.getElementById('updateOrderId').value;
    const status = document.getElementById('updateStatus').value;
    const note = document.getElementById('updateNote').value;
    
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index !== -1) {
        orders[index].status = status;
        orders[index].statusNote = note;
        localStorage.setItem('orders', JSON.stringify(orders));
        
        document.getElementById('orderModal').classList.remove('active');
        renderOrdersTable(document.getElementById('statusFilter').value);
        alert('Order status updated successfully!');
    }
}

function setupStatusFilter() {
    const filter = document.getElementById('statusFilter');
    if (filter) {
        filter.addEventListener('change', () => {
            renderOrdersTable(filter.value);
        });
    }
}

// Helper functions
function getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}

function getProjects() {
    return JSON.parse(localStorage.getItem('projects') || '[]');
}

function formatStatus(status) {
    const statuses = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statuses[status] || status;
}

function getCategoryName(cat) {
    const categories = {
        'mini': 'Mini Project',
        'be': 'BE Project',
        'science': 'Science Project'
    };
    return categories[cat] || cat;
}

function getDepartmentName(dept) {
    const departments = {
        'cse': 'CSE/IT',
        'ece': 'ECE',
        'eee': 'EEE',
        'mechanical': 'Mechanical',
        'civil': 'Civil',
        'other': 'Other'
    };
    return departments[dept] || dept;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin' && user.email === 'techindia2026@gmail.com';
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function protectAdminPage() {
    if (!isLoggedIn() || !isAdmin()) {
        window.location.href = '../login.html';
        return false;
    }
    return true;
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

function initializeProjects() {
    if (!localStorage.getItem('projects')) {
        const sampleProjects = [
            {
                id: 1,
                title: "Smart Home Automation System",
                category: "be",
                department: "cse",
                shortDesc: "IoT-based home automation with mobile app control",
                description: "A comprehensive smart home automation system that allows users to control home appliances through a mobile application.",
                features: ["IoT Integration", "Mobile App Control", "Voice Commands", "Sensor Automation"],
                status: "active"
            },
            {
                id: 2,
                title: "Hospital Management System",
                category: "be",
                department: "cse",
                shortDesc: "Complete hospital management with patient records",
                description: "A full-stack web application for managing hospital operations.",
                features: ["Patient Management", "Appointment Booking", "Billing System", "Medical Records"],
                status: "active"
            },
            {
                id: 3,
                title: "Automatic Plant Watering System",
                category: "mini",
                department: "ece",
                shortDesc: "Automatic irrigation system with soil moisture sensors",
                description: "An intelligent plant watering system that automatically waters plants.",
                features: ["Soil Moisture Sensor", "Automatic Watering", "Mobile Alert"],
                status: "active"
            }
        ];
        localStorage.setItem('projects', JSON.stringify(sampleProjects));
    }
}
