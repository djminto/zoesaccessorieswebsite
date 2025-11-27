// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product data
const products = [
    { id: 1, name: 'Gold Bracelet for both Men and Women', price: 1000, image: 'Image/Jewelry.png' },
    { id: 2, name: 'Satin Scrunchies for Women', price: 200, image: 'Image/Scrunchies.png' },
    { id: 3, name: 'White and Gold Bracelet for Women', price: 500, image: 'Image/White and Gold bracelet.png' },
    { id: 4, name: 'Blue Beaded Bracelet for Men', price: 300, image: 'Image/Male Bracelets.png' },
    { id: 5, name: 'Colored Bracelets for Women', price: 300, image: 'Image/Female Bracelets.png' },
    { id: 6, name: 'Bright Bracelets for both Men and Women', price: 300, image: 'Image/Bright colored bracelets.png' },
    { id: 7, name: 'Cute Silk Bows for Girls', price: 400, image: 'Image/Silk_Bows.png' },
    { id: 8, name: 'Gold Bracelets', price: 500, image: 'Image/Jewelry.png' },
    { id: 9, name: 'Scrunchies for Women', price: 200, image: 'Image/Scrunchies_Cute.png' },
    { id: 10, name: 'Bright Bracelets', price: 300, image: 'Image/Light Colored Bracelets.png' },
    { id: 11, name: 'Bracelets for Male', price: 300, image: 'Image/Male_bracelets Featured.png' },
    { id: 12, name: 'Bows for Women', price: 200, image: 'Image/Silk_Bows.png' },
    { id: 13, name: 'Bracelets for Girls', price: 300, image: 'Image/Fem-Bracelets_Category.png' },
    { id: 14, name: 'Bracelets for Girls', price: 300, image: 'Image/Female_Bracelets Featured.png' }
];

// Initialize cart count on page load
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Update cart quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
    showNotification('Item removed from cart');
}

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
}

// Render cart page
function renderCart() {
    const cartContentArea = document.getElementById('cartContentArea');
    if (!cartContentArea) return;
    
    if (cart.length === 0) {
        cartContentArea.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <a href="Home.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    const { subtotal, shipping, total } = calculateTotals();
    
    const cartItemsHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} JMD</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fa-solid fa-trash"></i> Remove
            </button>
        </div>
    `).join('');
    
    cartContentArea.innerHTML = `
        <div class="cart-content">
            <div class="cart-items">
                ${cartItemsHTML}
            </div>
            <div class="cart-summary">
                <h2>Order Summary</h2>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)} JMD</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)} JMD</span>
                </div>
                <button class="checkout-btn" onclick="openPaymentModal()">
                    <i class="fa-solid fa-lock"></i> Proceed to Checkout
                </button>
            </div>
        </div>
    `;
}

// Open payment modal
function openPaymentModal() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to proceed with checkout');
        window.location.href = 'login.html';
        return;
    }
    
    const { subtotal, total } = calculateTotals();
    document.getElementById('modalSubtotal').textContent = `$${subtotal.toFixed(2)} JMD`;
    document.getElementById('modalTotal').textContent = `$${total.toFixed(2)} JMD`;
    
    const paymentModal = document.getElementById('paymentModal');
    paymentModal.classList.add('active');
}

// Close payment modal
function closePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    paymentModal.classList.remove('active');
}

// Format card number input
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

// Format expiry date
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Process payment
async function processPayment(event) {
    event.preventDefault();
    
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const billingAddress = document.getElementById('billingAddress').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    const zipCode = document.getElementById('zipCode').value;
    
    // Basic validation
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        alert('Please enter a valid card number');
        return;
    }
    
    if (cvv.length < 3 || cvv.length > 4) {
        alert('Please enter a valid CVV');
        return;
    }
    
    const { total } = calculateTotals();
    
    // Show loading
    const submitBtn = event.target.querySelector('.payment-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Send order to backend
    const token = localStorage.getItem('token');
    
    if (!token) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Please login to complete your purchase.');
        window.location.href = 'login.html';
        return;
    }
    
    const orderData = {
        totalAmount: total,
        cardName: cardName,
        cardNumber: cardNumber,
        billingAddress: billingAddress,
        city: city,
        country: country,
        postalCode: zipCode,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }))
    };
    
    try {
        const response = await fetch('http://127.0.0.1:3000/api/orders/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Close modal
            closePaymentModal();
            
            // Show success message
            alert(`Payment Successful! \n\nOrder #${result.orderId}\nAmount: $${total.toFixed(2)} JMD\nThank you for your purchase!\n\nThe owner has been notified of your order.`);
            
            // Redirect to home
            window.location.href = 'Home.html';
        } else if (response.status === 401) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('Your session has expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Order placement failed');
        }
    } catch (error) {
        console.error('Order error:', error);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Failed to process order: ' + error.message + '\n\nPlease make sure you are logged in and try again.');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // If on cart page, render cart
    if (document.getElementById('cartContentArea')) {
        renderCart();
    }
    
    // Setup payment modal close button
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', closePaymentModal);
    }
    
    // Setup payment form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', processPayment);
    }
    
    // Card preview animations
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const cardPreview = document.getElementById('cardPreview');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            formatCardNumber(e.target);
            updateCardPreview();
        });
        cardNumberInput.addEventListener('focus', () => {
            if (cardPreview) cardPreview.classList.remove('flip');
        });
    }
    
    if (cardNameInput) {
        cardNameInput.addEventListener('input', updateCardPreview);
        cardNameInput.addEventListener('focus', () => {
            if (cardPreview) cardPreview.classList.remove('flip');
        });
    }
    
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', (e) => {
            formatExpiryDate(e.target);
            updateCardPreview();
        });
        expiryDateInput.addEventListener('focus', () => {
            if (cardPreview) cardPreview.classList.remove('flip');
        });
    }
    
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            updateCardPreview();
        });
        cvvInput.addEventListener('focus', () => {
            if (cardPreview) cardPreview.classList.add('flip');
        });
        cvvInput.addEventListener('blur', () => {
            if (cardPreview) cardPreview.classList.remove('flip');
        });
    }
    
    // Close modal on outside click
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                closePaymentModal();
            }
        });
    }
    
    // User authentication display
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const profileUsername = document.getElementById('profileUsername');
    const homeUsername = document.getElementById('homeUsername');
    const navUserBtn = document.getElementById('navUserBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (username && token && profileUsername) {
        profileUsername.textContent = username;
    }

    if (username && homeUsername) {
        homeUsername.textContent = username;
    }

    if (navUserBtn && profileDropdown) {
        navUserBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (token) {
                profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
            } else {
                window.location.href = 'login.html';
            }
        });

        document.addEventListener('click', function (e) {
            if (!profileDropdown.contains(e.target) && !navUserBtn.contains(e.target)) {
                profileDropdown.style.display = 'none';
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.reload();
        });
    }

    // Profile update form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const newUsername = document.getElementById('editUsername').value.trim();
            const newPassword = document.getElementById('editPassword').value;
            const token = localStorage.getItem('token');
            if (!token) return alert('You must be logged in.');

            const body = {};
            if (newUsername) body.username = newUsername;
            if (newPassword) body.password = newPassword;

            try {
                const response = await fetch('http://127.0.0.1:3000/api/auth/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Profile updated!');
                    if (newUsername) {
                        localStorage.setItem('username', newUsername);
                        if (profileUsername) profileUsername.textContent = newUsername;
                        if (homeUsername) homeUsername.textContent = newUsername;
                    }
                } else if (response.status === 401) {
                    alert('Unauthorized: Please log in again.');
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                } else {
                    let error = { message: 'Update failed.' };
                    try { error = await response.json(); } catch {}
                    alert(error.message || 'Update failed.');
                }
            } catch (error) {
                alert('Network error. Please try again.');
                console.error(error);
            }
        });
    }
});

// Fixed header on scroll
window.addEventListener('scroll', function() {
    var header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 0) {
            header.classList.add('header-fix');
        } else {
            header.classList.remove('header-fix');
        }
    }
});

// Card preview update function
function updateCardPreview() {
    const cardNumber = document.getElementById('cardNumber')?.value || '';
    const cardName = document.getElementById('cardName')?.value || '';
    const expiryDate = document.getElementById('expiryDate')?.value || '';
    const cvv = document.getElementById('cvv')?.value || '';
    
    // Update card number display
    const previewNumber = document.getElementById('previewNumber');
    if (previewNumber) {
        if (cardNumber) {
            previewNumber.textContent = cardNumber;
        } else {
            previewNumber.textContent = '#### #### #### ####';
        }
    }
    
    // Update cardholder name
    const previewName = document.getElementById('previewName');
    if (previewName) {
        if (cardName) {
            previewName.textContent = cardName.toUpperCase();
        } else {
            previewName.textContent = 'YOUR NAME';
        }
    }
    
    // Update expiry date
    const previewExpiry = document.getElementById('previewExpiry');
    if (previewExpiry) {
        if (expiryDate) {
            previewExpiry.textContent = expiryDate;
        } else {
            previewExpiry.textContent = 'MM/YY';
        }
    }
    
    // Update CVV
    const previewCVV = document.getElementById('previewCVV');
    if (previewCVV) {
        if (cvv) {
            previewCVV.textContent = cvv;
        } else {
            previewCVV.textContent = '***';
        }
    }
    
    // Detect card type and update styling
    detectCardType(cardNumber.replace(/\s/g, ''));
}

// Detect card type based on card number
function detectCardType(cardNumber) {
    const cardFront = document.getElementById('cardFront');
    const cardLogo = document.getElementById('cardLogo');
    const visaIcon = document.getElementById('visaIcon');
    const mastercardIcon = document.getElementById('mastercardIcon');
    const amexIcon = document.getElementById('amexIcon');
    
    // Remove all active classes
    if (visaIcon) visaIcon.classList.remove('active');
    if (mastercardIcon) mastercardIcon.classList.remove('active');
    if (amexIcon) amexIcon.classList.remove('active');
    if (cardFront) {
        cardFront.classList.remove('visa', 'mastercard', 'amex');
    }
    
    // Visa: starts with 4
    if (cardNumber.startsWith('4')) {
        if (cardFront) cardFront.classList.add('visa');
        if (cardLogo) {
            cardLogo.className = 'fa-brands fa-cc-visa card-logo';
        }
        if (visaIcon) visaIcon.classList.add('active');
    }
    // Mastercard: starts with 51-55 or 2221-2720
    else if (/^5[1-5]/.test(cardNumber) || /^2[2-7]/.test(cardNumber)) {
        if (cardFront) cardFront.classList.add('mastercard');
        if (cardLogo) {
            cardLogo.className = 'fa-brands fa-cc-mastercard card-logo';
        }
        if (mastercardIcon) mastercardIcon.classList.add('active');
    }
    // American Express: starts with 34 or 37
    else if (/^3[47]/.test(cardNumber)) {
        if (cardFront) cardFront.classList.add('amex');
        if (cardLogo) {
            cardLogo.className = 'fa-brands fa-cc-amex card-logo';
        }
        if (amexIcon) amexIcon.classList.add('active');
    }
    // Default
    else if (cardNumber.length > 0) {
        if (cardLogo) {
            cardLogo.className = 'fa-solid fa-credit-card card-logo';
        }
    } else {
        if (cardLogo) {
            cardLogo.className = 'fa-brands fa-cc-visa card-logo';
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
