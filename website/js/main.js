// Sample Project Data (will be replaced by localStorage data)
const sampleProjects = [
    {
        id: 1,
        title: "Smart Home Automation System",
        category: "be",
        department: "cse",
        shortDesc: "IoT-based home automation with mobile app control",
        description: "A comprehensive smart home automation system that allows users to control home appliances through a mobile application. The system uses Arduino/Raspberry Pi as the main controller and integrates various sensors for automation.",
        features: ["IoT Integration", "Mobile App Control", "Voice Commands", "Sensor Automation", "Energy Monitoring"],
        status: "active"
    },
    {
        id: 2,
        title: "Hospital Management System",
        category: "be",
        department: "cse",
        shortDesc: "Complete hospital management with patient records",
        description: "A full-stack web application for managing hospital operations including patient registration, appointment scheduling, doctor management, billing, and medical records management.",
        features: ["Patient Management", "Appointment Booking", "Billing System", "Medical Records", "Report Generation"],
        status: "active"
    },
    {
        id: 3,
        title: "Automatic Plant Watering System",
        category: "mini",
        department: "ece",
        shortDesc: "Automatic irrigation system with soil moisture sensors",
        description: "An intelligent plant watering system that automatically waters plants based on soil moisture levels. Features real-time monitoring and can be controlled via smartphone.",
        features: ["Soil Moisture Sensor", "Automatic Watering", "Mobile Alert", "Water Level Monitoring", "Solar Powered"],
        status: "active"
    },
    {
        id: 4,
        title: "Solar Power Monitoring System",
        category: "be",
        department: "eee",
        shortDesc: "Monitor and optimize solar panel efficiency",
        description: "A system to monitor solar panel performance, track energy generation, and optimize power usage. Includes real-time data visualization and efficiency reports.",
        features: ["Real-time Monitoring", "Efficiency Analysis", "Mobile App", "Data Logging", "Alert System"],
        status: "active"
    },
    {
        id: 5,
        title: "Smart Traffic Control System",
        category: "be",
        department: "ece",
        shortDesc: "Intelligent traffic management using image processing",
        description: "An intelligent traffic control system that uses image processing and machine learning to optimize traffic signal timing based on vehicle density.",
        features: ["Image Processing", "Machine Learning", "Real-time Analysis", "Emergency Vehicle Priority", "Traffic Density Reports"],
        status: "active"
    },
    {
        id: 6,
        title: "Biometric Attendance System",
        category: "mini",
        department: "cse",
        shortDesc: "Fingerprint-based attendance management",
        description: "A biometric attendance system using fingerprint recognition for employee/student attendance tracking with report generation capabilities.",
        features: ["Fingerprint Recognition", "Real-time Tracking", "Report Generation", "Database Integration", "Email Alerts"],
        status: "active"
    },
    {
        id: 7,
        title: "Water Quality Monitoring",
        category: "science",
        department: "eee",
        shortDesc: "Real-time water quality analysis system",
        description: "A science project that monitors water quality parameters like pH, turbidity, and temperature. Ideal for environmental science studies.",
        features: ["pH Sensor", "Turbidity Measurement", "Temperature Monitoring", "Data Display", "Alert System"],
        status: "active"
    },
    {
        id: 8,
        title: "Robotic Arm Control",
        category: "mini",
        department: "mechanical",
        shortDesc: "Arduino-controlled robotic arm with 4 DOF",
        description: "A robotic arm project with 4 degrees of freedom controlled via Arduino. Can be programmed for various pick-and-place operations.",
        features: ["4 DOF Movement", "Arduino Control", "Gripper Mechanism", "Remote Control", "Programmable Path"],
        status: "active"
    },
    {
        id: 9,
        title: "Online Examination System",
        category: "be",
        department: "cse",
        shortDesc: "Complete online exam platform with proctoring",
        description: "A comprehensive online examination platform with features like question bank management, automated grading, anti-cheating measures, and detailed analytics.",
        features: ["Question Bank", "Auto Grading", "Proctoring System", "Analytics Dashboard", "Certificate Generation"],
        status: "active"
    },
    {
        id: 10,
        title: "Weather Monitoring Station",
        category: "science",
        department: "ece",
        shortDesc: "Complete weather data collection and display",
        description: "A weather monitoring station that measures temperature, humidity, pressure, and rainfall. Data can be viewed on LCD display or transmitted to a web server.",
        features: ["Temperature Sensor", "Humidity Sensor", "Rain Gauge", "Wind Speed", "Web Interface"],
        status: "active"
    },
    {
        id: 11,
        title: "Electric Vehicle Charging Station",
        category: "be",
        department: "eee",
        shortDesc: "Smart EV charging with payment integration",
        description: "A smart electric vehicle charging station prototype with payment integration, user authentication, and charging status monitoring.",
        features: ["RFID Authentication", "Payment System", "Real-time Monitoring", "Mobile App", "Energy Metering"],
        status: "active"
    },
    {
        id: 12,
        title: "Library Management System",
        category: "mini",
        department: "cse",
        shortDesc: "Digital library with book tracking and fines",
        description: "A complete library management system with book cataloging, member management, issue/return tracking, and fine calculation features.",
        features: ["Book Catalog", "Member Management", "Barcode Scanner", "Fine Calculation", "Email Reminders"],
        status: "active"
    }
];

// Initialize projects in localStorage if not exists
function initializeProjects() {
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify(sampleProjects));
    }
}

// Get projects from localStorage
function getProjects() {
    return JSON.parse(localStorage.getItem('projects') || '[]');
}

// Render project cards
function renderProjects(filter = 'all') {
    const projects = getProjects();
    const projectGrid = document.getElementById('projectGrid');
    
    if (!projectGrid) return;
    
    const filteredProjects = filter === 'all' 
        ? projects.filter(p => p.status === 'active')
        : projects.filter(p => (p.category === filter || p.department === filter) && p.status === 'active');
    
    projectGrid.innerHTML = filteredProjects.map(project => `
        <div class="project-card" data-id="${project.id}">
            <div class="project-card-header">
                <h3>${project.title}</h3>
                <span class="category">${getCategoryName(project.category)}</span>
            </div>
            <div class="project-card-body">
                <p>${project.shortDesc}</p>
            </div>
            <div class="project-card-footer">
                <span class="department">${getDepartmentName(project.department)}</span>
                <span class="view-details">View Details <i class="fas fa-arrow-right"></i></span>
            </div>
        </div>
    `).join('');

    // Add click events
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => openProjectModal(card.dataset.id));
    });
}

// Get category display name
function getCategoryName(cat) {
    const categories = {
        'mini': 'Mini Project',
        'be': 'BE Project',
        'science': 'Science Project'
    };
    return categories[cat] || cat;
}

// Get department display name
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

// Open project modal
function openProjectModal(projectId) {
    const projects = getProjects();
    const project = projects.find(p => p.id == projectId);
    
    if (!project) return;
    
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalCategory').textContent = getCategoryName(project.category) + ' - ' + getDepartmentName(project.department);
    document.getElementById('modalDescription').textContent = project.description;
    
    const featuresHtml = project.features && project.features.length > 0 
        ? `<h4>Key Features:</h4><ul>${project.features.map(f => `<li>${f}</li>`).join('')}</ul>`
        : '';
    document.getElementById('modalFeatures').innerHTML = featuresHtml;
    
    document.getElementById('downloadPdf').onclick = () => downloadAbstract(project);
    document.getElementById('orderProject').onclick = () => openOrderModal(project);
    
    document.getElementById('projectModal').classList.add('active');
}

// Download abstract as PDF (simulated)
function downloadAbstract(project) {
    // Create a simple text file as PDF simulation
    const content = `
TECHINDIA PROJECT CENTER
========================

Project Title: ${project.title}

Category: ${getCategoryName(project.category)}
Department: ${getDepartmentName(project.department)}

Description:
${project.description}

Key Features:
${project.features ? project.features.map(f => '• ' + f).join('\n') : 'N/A'}

---
Contact: techindia2026@gmail.com
Phone: 9940584023, 8300680753
Address: No83 PERIYAR SALAI, CHENGAPATU, UNAMANCHERI, KOLAPAKKAM, CHENNAI-600127
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_abstract.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Open order modal
function openOrderModal(project) {
    document.getElementById('projectModal').classList.remove('active');
    document.getElementById('orderProjectId').value = project.id;
    document.getElementById('orderProjectTitle').textContent = project.title;
    document.getElementById('orderModal').classList.add('active');
}

// Generate 6-digit order code
function generateOrderCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Handle order submission
function handleOrderSubmit(e) {
    e.preventDefault();
    
    const projectId = document.getElementById('orderProjectId').value;
    const projects = getProjects();
    const project = projects.find(p => p.id == projectId);
    
    const order = {
        id: 'ORD' + Date.now(),
        projectId: projectId,
        projectTitle: project ? project.title : 'Unknown Project',
        name: document.getElementById('orderName').value,
        mobile: document.getElementById('orderMobile').value,
        email: document.getElementById('orderEmail').value,
        address: document.getElementById('orderAddress').value,
        pincode: document.getElementById('orderPincode').value,
        orderCode: generateOrderCode(),
        status: 'pending',
        statusNote: 'Order received. Waiting for confirmation.',
        orderDate: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };
    
    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show success message
    alert(`Order placed successfully!\n\nYour Order Code: ${order.orderCode}\n\nPlease save this code to check your order status.`);
    
    // Close modal and reset form
    document.getElementById('orderModal').classList.remove('active');
    document.getElementById('orderForm').reset();
}

// Filter buttons
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });
}

// Modal close functionality
function setupModals() {
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Hamburger menu
function setupHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeProjects();
    renderProjects();
    setupFilterButtons();
    setupModals();
    setupHamburger();
    
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
});
