// ==========================================
// ZOIE'S ACCESSORIES - Admin Dashboard JS
// ==========================================

// Load real orders from localStorage (created during checkout)
let orders = JSON.parse(localStorage.getItem('orders')) || [];

let customers = JSON.parse(localStorage.getItem('admin_customers')) || [];

// ========== NAVIGATION ==========
function initAdminNav() {
    const navLinks = document.querySelectorAll('.admin-nav-link[data-section]');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.dataset.section;
            
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            link.classList.add('active');
            document.getElementById(`${sectionName}-section`).classList.add('active');
            
            // Load section-specific data
            if (sectionName === 'orders') loadOrders();
            if (sectionName === 'customers') loadCustomers();
            if (sectionName === 'reviews') loadAdminReviews();
        });
    });
}

// ========== DASHBOARD STATS ==========
function loadDashboardStats() {
    // Count only active (non-deleted) orders for total
    const activeOrders = orders.filter(o => !o.deleted);
    const totalOrders = activeOrders.length;
    const pendingOrders = activeOrders.filter(o => o.status === 'pending').length;
    
    // Include deleted orders in completed count and revenue (for record keeping)
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    
    document.getElementById('totalOrdersCount').textContent = totalOrders;
    document.getElementById('pendingOrdersCount').textContent = pendingOrders;
    document.getElementById('completedOrdersCount').textContent = completedOrders;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    
    loadRecentOrders();
}

function loadRecentOrders() {
    const tbody = document.querySelector('#recentOrdersTable tbody');
    if (!tbody) return;
    
    // Show only active (non-deleted) orders
    const activeOrders = orders.filter(o => !o.deleted);
    const recentOrders = activeOrders.slice(0, 5);
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No orders yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>${order.orderNumber}</td>
            <td>${order.customer.name}</td>
            <td>${new Date(order.orderDate || order.createdAt).toLocaleDateString()}</td>
            <td>$${order.total.toFixed(2)} JMD</td>
            <td><span class="order-status ${order.status}">${order.status}</span></td>
        </tr>
    `).join('');
}

// ========== ORDERS MANAGEMENT ==========
function loadOrders(filter = 'all') {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;
    
    // Filter out deleted orders from display
    const activeOrders = orders.filter(o => !o.deleted);
    const filteredOrders = filter === 'all' 
        ? activeOrders 
        : activeOrders.filter(o => o.status === filter);
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredOrders.map((order, displayIndex) => {
        const actualIndex = orders.findIndex(o => o.orderNumber === order.orderNumber);
        const showDelete = order.status === 'completed';
        
        return `
        <tr>
            <td>${order.orderNumber || `#ORD-${displayIndex + 1}`}</td>
            <td>${order.customer.name}</td>
            <td>${order.customer.email}</td>
            <td>${order.customer.phone}</td>
            <td>${new Date(order.orderDate || order.createdAt).toLocaleDateString()}</td>
            <td>$${order.total.toFixed(2)} JMD</td>
            <td>
                <select class="order-status-select" onchange="updateOrderStatus(${actualIndex}, this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
            <td>
                <button class="btn-action btn-view" onclick="viewOrderDetails(${actualIndex})">
                    <i class="fas fa-eye"></i> View
                </button>
                ${showDelete ? `
                <button class="btn-action btn-delete" onclick="deleteOrder(${actualIndex})" style="margin-left: 5px;">
                    <i class="fas fa-trash"></i> Delete
                </button>
                ` : ''}
            </td>
        </tr>
        `;
    }).join('');
}

function updateOrderStatus(orderIndex, newStatus) {
    if (orders[orderIndex]) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        showAdminNotification(`Order ${orders[orderIndex].orderNumber} status updated to ${newStatus}`, 'success');
        loadDashboardStats();
        loadOrders(document.querySelector('.filter-tab.active')?.dataset.status || 'all');
    }
}

function deleteOrder(orderIndex) {
    const order = orders[orderIndex];
    if (!order) return;
    
    if (!confirm(`Delete order ${order.orderNumber}?\n\nThis order will be removed from the orders list but will still count toward your total revenue and completed orders for record keeping.`)) {
        return;
    }
    
    // Mark as deleted instead of removing
    orders[orderIndex].deleted = true;
    orders[orderIndex].deletedAt = new Date().toISOString();
    
    localStorage.setItem('orders', JSON.stringify(orders));
    showAdminNotification(`Order ${order.orderNumber} deleted successfully`, 'success');
    
    // Reload the current view
    const activeFilter = document.querySelector('.filter-tab.active')?.dataset.status || 'all';
    loadOrders(activeFilter);
    loadDashboardStats();
}

function viewOrderDetails(orderIndex) {
    const order = orders[orderIndex];
    if (!order) return;
    
    const modal = document.getElementById('orderDetailsModal');
    const modalBody = document.getElementById('orderDetailsBody');
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h3>${order.orderNumber}</h3>
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Shipping Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.parish}</p>
            <p><strong>Date:</strong> ${new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span class="order-status ${order.status}">${order.status}</span></p>
        </div>
        
        <h4>Order Items:</h4>
        <table style="width: 100%; margin-bottom: 1rem;">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price} JMD</td>
                        <td>$${(item.price * item.quantity).toFixed(2)} JMD</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div style="text-align: right; font-size: 1.2rem; font-weight: 700;">
            <strong>Total: $${order.total.toFixed(2)} JMD</strong>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Close modal
    modal.querySelector('.modal-close').onclick = () => modal.classList.remove('active');
    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
    };
}

// ========== CUSTOMERS MANAGEMENT ==========
function loadCustomers() {
    const tbody = document.querySelector('#customersTable tbody');
    if (!tbody) return;
    
    // Get unique customers from orders
    const customerEmails = new Set();
    const uniqueCustomers = [];
    
    orders.forEach(order => {
        if (!customerEmails.has(order.customer.email)) {
            customerEmails.add(order.customer.email);
            uniqueCustomers.push({
                name: order.customer.name,
                email: order.customer.email,
                joined: order.orderDate || order.createdAt,
                orderCount: orders.filter(o => o.customer.email === order.customer.email).length
            });
        }
    });
    
    if (uniqueCustomers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No customers yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = uniqueCustomers.map((customer, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${new Date(customer.joined).toLocaleDateString()}</td>
            <td>${customer.orderCount}</td>
            <td>
                <button class="btn-action btn-view" onclick="viewCustomerOrders('${customer.email}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewCustomerOrders(email) {
    const customerOrders = orders.filter(o => o.customer.email === email);
    showAdminNotification(`Customer has ${customerOrders.length} order(s)`, 'info');
    // Switch to orders section and filter
    document.querySelector('[data-section="orders"]').click();
}

// ========== REVIEWS MANAGEMENT ==========
function loadAdminReviews() {
    const reviewsGrid = document.getElementById('reviewsGridAdmin');
    if (!reviewsGrid) return;
    
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    if (reviews.length === 0) {
        reviewsGrid.innerHTML = '<p style="text-align: center; padding: 3rem;">No reviews yet.</p>';
        return;
    }
    
    reviewsGrid.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${review.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
                    </div>
                </div>
                <div>
                    <div class="review-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                    </div>
                    <button class="btn-action btn-delete" onclick="deleteReview(${review.id})" style="margin-top: 0.5rem;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <p class="review-text">${review.message}</p>
        </div>
    `).join('');
}

function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    showAdminNotification('Review deleted successfully', 'success');
    loadAdminReviews();
}

// ========== ORDER FILTERS ==========
function initOrderFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const status = tab.dataset.status;
            loadOrders(status);
        });
    });
}

// ========== ADMIN LOGOUT ==========
document.getElementById('adminLogout')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        showAdminNotification('Logging out...', 'info');
        setTimeout(() => window.location.href = 'login.html', 1500);
    }
});

// ========== NOTIFICATIONS ==========
function showAdminNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== ADMIN AUTHENTICATION ==========
async function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Check if user is logged in
    if (!currentUser || !currentUser.email) {
        showAdminNotification('Please login to access admin panel', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return false;
    }
    
    // Check if user is admin (zoesacessories23@gmail.com)
    const adminEmail = 'zoesacessories23@gmail.com';
    if (currentUser.email !== adminEmail) {
        showAdminNotification('Access denied. Admin privileges required.', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return false;
    }
    
    // Set admin name
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) {
        adminNameEl.textContent = currentUser.username || 'Admin';
    }
    
    return true;
}

// ========== PRODUCTS MANAGEMENT ==========
function loadAdminProducts() {
    const container = document.getElementById('productsGridAdmin');
    if (!container) return;
    
    // Get products from main script.js
    if (typeof products === 'undefined') {
        container.innerHTML = '<p style="text-align: center; padding: 3rem;">Unable to load products.</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card-admin">
            <div class="product-image-admin">
                <img src="${product.image}" alt="${product.name}">
                <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-info-admin">
                <h4>${product.name}</h4>
                <p class="product-price">$${product.price} JMD</p>
                <p class="product-category">${product.category}</p>
                <div class="product-actions">
                    <button class="btn-action btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('addProductForm').reset();
    }
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Reset form and remove edit state
        const form = document.getElementById('addProductForm');
        if (form) {
            form.reset();
            delete form.dataset.editId;
        }
        
        // Reset modal title and button
        const modalTitle = modal.querySelector('.modal-header h2');
        if (modalTitle) modalTitle.textContent = 'Add New Product';
        
        const submitBtn = form?.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
        }
    }
}

function addProduct(productData, editId = null) {
    if (typeof products === 'undefined') {
        showAdminNotification('Unable to access products', 'error');
        return;
    }
    
    if (editId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(editId));
        if (index > -1) {
            products[index] = {
                id: parseInt(editId),
                name: productData.name,
                price: parseFloat(productData.price),
                category: productData.category,
                image: productData.image,
                badge: productData.badge
            };
            showAdminNotification('Product updated successfully!', 'success');
        }
    } else {
        // Generate new ID
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        const newProduct = {
            id: newId,
            name: productData.name,
            price: parseFloat(productData.price),
            category: productData.category,
            image: productData.image,
            badge: productData.badge
        };
        
        products.push(newProduct);
        showAdminNotification('Product added successfully!', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    loadAdminProducts();
    closeAddProductModal();
    
    // Reload the page to refresh products everywhere
    setTimeout(() => window.location.reload(), 1000);
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    if (typeof products === 'undefined') {
        showAdminNotification('Unable to access products', 'error');
        return;
    }
    
    const index = products.findIndex(p => p.id === productId);
    if (index > -1) {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        showAdminNotification('Product deleted successfully', 'success');
        loadAdminProducts();
        
        // Reload the page to refresh products everywhere
        setTimeout(() => window.location.reload(), 1000);
    } else {
        showAdminNotification('Product not found', 'error');
    }
}

function editProduct(productId) {
    if (typeof products === 'undefined') {
        showAdminNotification('Unable to access products', 'error');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        showAdminNotification('Product not found', 'error');
        return;
    }
    
    // Open modal and populate with product data
    const modal = document.getElementById('addProductModal');
    if (!modal) return;
    
    // Change modal title
    const modalTitle = modal.querySelector('.modal-header h2');
    if (modalTitle) modalTitle.textContent = 'Edit Product';
    
    // Populate form
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productBadge').value = product.badge;
    
    // Store product ID for update
    const form = document.getElementById('addProductForm');
    form.dataset.editId = productId;
    
    // Change button text
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
    }
    
    modal.classList.add('active');
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    // Check admin access first
    if (window.location.pathname.includes('admin.html')) {
        const hasAccess = await checkAdminAccess();
        if (!hasAccess) return;
    }
    
    initAdminNav();
    initOrderFilters();
    loadDashboardStats();
    loadAdminProducts();
    
    // Add Product Button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openAddProductModal);
    }
    
    // Close modal buttons
    const closeAddProduct = document.getElementById('closeAddProduct');
    if (closeAddProduct) {
        closeAddProduct.addEventListener('click', closeAddProductModal);
    }
    
    // Add Product Form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('productName').value,
                price: document.getElementById('productPrice').value,
                category: document.getElementById('productCategory').value,
                image: document.getElementById('productImage').value,
                badge: document.getElementById('productBadge').value
            };
            
            // Check if editing or adding
            const editId = addProductForm.dataset.editId;
            addProduct(formData, editId);
        });
    }
    
    // Close modal on outside click
    const addProductModal = document.getElementById('addProductModal');
    if (addProductModal) {
        addProductModal.addEventListener('click', (e) => {
            if (e.target === addProductModal) {
                closeAddProductModal();
            }
        });
    }
    
    // Update navigation to load products
    const productsNavLink = document.querySelector('[data-section="products"]');
    if (productsNavLink) {
        productsNavLink.addEventListener('click', () => {
            loadAdminProducts();
        });
    }
});
