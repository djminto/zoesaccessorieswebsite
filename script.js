// ========== STAR RATING INIT ========== 
function initStarRating() {
    const starRating = document.getElementById('starRating');
    if (!starRating) return;
    const stars = starRating.querySelectorAll('i');
    const ratingValue = document.getElementById('ratingValue');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingValue.value = rating;
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('fas');
                    s.classList.remove('far');
                } else {
                    if (!s.classList.contains('active')) {
                        s.classList.add('far');
                        s.classList.remove('fas');
                    }
                }
            });
        });
    });
    starRating.addEventListener('mouseleave', function() {
        const currentRating = parseInt(ratingValue.value) || 0;
        stars.forEach((s, index) => {
            if (index < currentRating) {
                s.classList.add('fas', 'active');
                s.classList.remove('far');
            } else {
                s.classList.add('far');
                s.classList.remove('fas', 'active');
            }
        });
    });
}
// ========== USER UI UPDATE ========== 
function updateUserUI() {
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (!userBtn || !userDropdown) return;
    if (currentUser) {
        // User is logged in - show profile picture or icon
        if (currentUser.profilePicture) {
            userBtn.innerHTML = `<img src="${currentUser.profilePicture}" alt="Profile" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">`;
        } else {
            userBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
        }
        userBtn.classList.add('active');
        // Show admin link in footer if user is admin
        const adminLink = document.getElementById('adminLink');
        if (adminLink && currentUser.isAdmin) {
            adminLink.style.display = 'block';
        }
        const profilePicHtml = currentUser.profilePicture 
            ? `<img src="${currentUser.profilePicture}" alt="Profile" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; margin-bottom: 8px;">`
            : '<i class="fas fa-user-circle" style="font-size: 48px; color: #ff1493; margin-bottom: 8px;"></i>';
        userDropdown.innerHTML = `
            <div class="dropdown-header">
                ${profilePicHtml}
                <h4>${currentUser.username}${currentUser.isAdmin ? ' <span style="background: #ff1493; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; margin-left: 4px;">ADMIN</span>' : ''}</h4>
                <p>${currentUser.email}</p>
            </div>
            ${currentUser.isAdmin ? '<a href="admin.html" class="dropdown-item"><i class="fas fa-crown"></i><span>Admin Dashboard</span></a>' : ''}
            <a href="profile.html" class="dropdown-item">
                <i class="fas fa-user"></i>
                <span>My Profile</span>
            </a>
            <a href="profile.html#orders" class="dropdown-item">
                <i class="fas fa-shopping-bag"></i>
                <span>My Orders</span>
            </a>
            <a href="profile.html#settings" class="dropdown-item">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item logout" id="dropdownLogout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </a>
        `;
        // Add logout handler
        const logoutBtn = document.getElementById('dropdownLogout');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                logout();
            };
        }
    } else {
        // User is not logged in - show login/register options
        userBtn.innerHTML = '<i class="fas fa-user"></i>';
        userBtn.classList.remove('active');
        userDropdown.innerHTML = `
            <div class="dropdown-login-prompt">
                <p>Sign in to access your account</p>
                <a href="login.html" class="btn btn-primary" style="width: 100%; margin-bottom: 0.5rem;">
                    <span>Login</span>
                </a>
                <a href="register.html" class="btn btn-outline" style="width: 100%;">
                    <span>Register</span>
                </a>
            </div>
        `;
    }
    // Toggle dropdown on click
    userBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        userDropdown.classList.toggle('active');
        // Close other dropdowns if any
        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
            if (dropdown !== userDropdown) {
                dropdown.classList.remove('active');
            }
        });
    };
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            userDropdown.classList.remove('active');
        }
    });
}
// ==========================================
// ZOIE'S ACCESSORIES - Main JavaScript File
// ==========================================

// ========== GLOBAL VARIABLES ==========
const API_URL = 'http://localhost:5000/api'; // Update with your backend URL
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

console.log('script.js loaded');
console.log('currentUser from localStorage:', currentUser);

// ========== PRODUCT DATA ==========
// Load products from localStorage if available, otherwise use default
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'Pink Charm Bracelet', price: 350, category: 'bracelets', image: 'Image/Pink Bracelet 3.png', badge: 'New' },
    { id: 2, name: 'Purple Bracelet for Females', price: 350, category: 'bracelets', image: 'Image/Female Bracelit purple.jpg', badge: 'Hot' },
    { id: 3, name: 'Stunning Blue Male Bracelet ', price: 350, category: 'bracelets', image: 'Image/Male_bracelets Featured.png', badge: 'Bestseller' },
    { id: 4, name: 'Luxury Scrunchies', price: 200, category: 'scrunchies', image: 'Image/Scrunchies.png', badge: 'Sale' },
    { id: 5, name: 'Beaded Bracelet', price: 350, category: 'bracelets', image: 'Image/Male Bracelets.png', badge: 'New' },
    { id: 6, name: 'Colorful Bracelets', price: 350, category: 'bracelets', image: 'Image/Female Bracelets.png', badge: 'Hot' },
    { id: 7, name: 'Silk Bow Collection', price: 400, category: 'bows', image: 'Image/Silk_Bows.png', badge: 'Bestseller' },
    { id: 8, name: 'Gold Chain Bracelet', price: 500, category: 'jewelry', image: 'Image/Jewelry.png', badge: 'New' },
    { id: 9, name: 'Bright Color Bracelets for Both Male and Female', price: 350, category: 'bracelets', image: 'Image/Bright colored bracelets.png', badge: 'New' },
	{ id: 10, name: 'White and Gold Bracelet', price: 450, category: 'bracelets', image: 'Image/White and Gold bracelet.png', badge: 'Hot' }
];
// Save default products to localStorage if not already saved
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
}

// ========== CART FUNCTIONS ==========

function loadCartPage() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer || !cartSubtotal || !cartTax || !cartTotal) return;

    // Clear previous items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        cartSubtotal.textContent = '$0.00 JMD';
        cartTax.textContent = '$0.00 JMD';
        cartTotal.textContent = '$0.00 JMD';
        return;
    } else {
        if (emptyCart) emptyCart.style.display = 'none';
    }

    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}" />
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Price: $${item.price} JMD</p>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <p>Total: $${itemTotal} JMD</p>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    // Calculate tax (e.g., 15%)
    const tax = Math.round(subtotal * 0.15);
    const total = subtotal + tax;
    cartSubtotal.textContent = `$${subtotal.toLocaleString()} JMD`;
    cartTax.textContent = `$${tax.toLocaleString()} JMD`;
    cartTotal.textContent = `$${total.toLocaleString()} JMD`;
}
function updateCartCount() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === parseInt(productId));
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
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            if (window.location.pathname.includes('cart.html')) {
                loadCartPage();
            }
        }
    }
}

function showWelcomeMessage() {
    // Clear any existing messages first
    const messagesContainer = document.getElementById('chatbotMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
    }
    
    const userName = currentUser ? currentUser.username : 'there';
    const welcomeMsg = `Hi ${userName}! 👋 Welcome to Zoie's Accessories! I'm here to help you find the perfect handcrafted accessories. What can I help you with today?`;
    addChatMessage(welcomeMsg, 'bot');
    
    // Show quick reply buttons
    setTimeout(() => {
        addQuickReplies([
            '🛍️ Browse Products',
            '💰 Check Prices',
            '🚚 Shipping Info',
            '📞 Contact Us'
        ]);
    }, 800);
}

function sendChatMessage(text = null) {
    const input = document.getElementById('chatbotInput');
    const message = text || input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    if (!text) input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot response with variable delay for natural feel
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
        removeTypingIndicator();
        const responses = getChatbotResponse(message);
        
        // Send responses with slight delays between them
        if (Array.isArray(responses)) {
            responses.forEach((response, index) => {
                setTimeout(() => {
                    if (typeof response === 'string') {
                        addChatMessage(response, 'bot');
                    } else if (response.type === 'quickReplies') {
                        addQuickReplies(response.options);
                    }
                }, index * 400);
            });
        } else {
            addChatMessage(responses, 'bot');
        }
    }, delay);
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    // Convert URLs to clickable links and handle HTML formatting
    const formattedText = text.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" style="color: #ff1493; text-decoration: underline;">$1</a>'
    );
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${sender === 'bot' ? '🤖' : '👤'}
        </div>
        <div class="message-bubble">${formattedText}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator-message';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function addQuickReplies(options) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const quickRepliesDiv = document.createElement('div');
    quickRepliesDiv.className = 'quick-replies';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'quick-reply-btn';
        button.textContent = option;
        button.onclick = () => {
            // Remove quick replies after selection
            quickRepliesDiv.remove();
            
            // Handle special actions
            if (handleQuickReplyAction(option)) {
                addChatMessage(option, 'user');
            } else {
                sendChatMessage(option);
            }
        };
        quickRepliesDiv.appendChild(button);
    });
    
    messagesContainer.appendChild(quickRepliesDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleQuickReplyAction(action) {
    const actionMap = {
        'View Shop Page': () => {
            addChatMessage('Opening the shop page for you! 🛍️', 'bot');
            setTimeout(() => window.location.href = 'shop.html', 1000);
            return true;
        },
        'Visit Shop': () => {
            addChatMessage('Taking you to our shop! 🛍️', 'bot');
            setTimeout(() => window.location.href = 'shop.html', 1000);
            return true;
        },
        'Shop Now': () => {
            addChatMessage("Let's go shopping! 🛍️", 'bot');
            setTimeout(() => window.location.href = 'shop.html', 1000);
            return true;
        },
        'Email Us': () => {
            addChatMessage('Opening your email client... 📧', 'bot');
            setTimeout(() => window.location.href = 'mailto:zoesacessories23@gmail.com', 500);
            return true;
        },
        'WhatsApp Us': () => {
            addChatMessage('Opening WhatsApp... 📱', 'bot');
            setTimeout(() => window.open('https://wa.me/18765440766', '_blank'), 500);
            return true;
        },
        'WhatsApp Chat': () => {
            addChatMessage('Connecting you to WhatsApp... 💬', 'bot');
            setTimeout(() => window.open('https://wa.me/18765440766', '_blank'), 500);
            return true;
        },
        'View FAQ': () => {
            addChatMessage('Opening our FAQ page... 📋', 'bot');
            setTimeout(() => window.location.href = 'faq.html', 1000);
            return true;
        },
        'Login Now': () => {
            addChatMessage('Taking you to login... 🔐', 'bot');
            setTimeout(() => window.location.href = 'login.html', 1000);
            return true;
        },
        'Create Account': () => {
            addChatMessage("Let's create your account! ✨", 'bot');
            setTimeout(() => window.location.href = 'register.html', 1000);
            return true;
        },
        'Track Order': () => {
            if (currentUser) {
                addChatMessage('Opening your orders... 📦', 'bot');
                setTimeout(() => window.location.href = 'dashboard.html#orders', 1000);
            } else {
                addChatMessage('Please login first to track your orders! 🔐', 'bot');
                setTimeout(() => {
                    addQuickReplies(['Login Now', 'Create Account']);
                }, 500);
            }
            return true;
        }
    };
    
    const handler = actionMap[action];
    if (handler) {
        handler();
        return true;
    }
    return false;
}

function getChatbotResponse(message) {
    const msg = message.toLowerCase();
    
    // Greetings
    if (msg.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
        const greetings = [
            "Hello! 😊 Welcome to Zoie's Accessories! I'm here to help you find beautiful handcrafted accessories.",
            "Hi there! 👋 Thanks for chatting with us! How can I make your shopping experience amazing today?",
            "Hey! 💖 Great to see you! I'm your personal shopping assistant. What are you looking for?"
        ];
        return [greetings[Math.floor(Math.random() * greetings.length)], 
                { type: 'quickReplies', options: ['🛍️ Browse Products', '💰 Pricing', '🚚 Shipping', '❓ FAQ'] }];
    }
    
    // Products & Shopping
    if (msg.match(/\b(product|item|shop|browse|buy|purchase|collection|catalog|available|seller|arrival|view)\b/) || msg.includes('🛍️')) {
        if (msg.includes('bracelet')) {
            return [
                "We have an amazing bracelet collection! 💎\n\n" +
                "• Pink Charm Bracelets ($350)\n" +
                "• Purple Female Bracelets ($350)\n" +
                "• Blue Male Bracelets ($350)\n" +
                "• Beaded Bracelets ($350)\n" +
                "• Gold Chain Bracelets ($500)\n\n" +
                "All handcrafted with premium materials! Visit our shop to see the full collection.",
                { type: 'quickReplies', options: ['View Shop Page', 'Other Products', 'Add to Cart'] }
            ];
        } else if (msg.includes('scrunchie')) {
            return "Our Luxury Scrunchies are a customer favorite! 🎀 Made with premium fabrics, they're gentle on your hair and look gorgeous. Only $200! Would you like to see them in the shop?";
        } else if (msg.includes('bow')) {
            return "Check out our Silk Bow Collection! 🎀 Perfect for any occasion, beautifully crafted and priced at $400. They make great gifts too!";
        } else if (msg.includes('jewelry')) {
            return "Our jewelry collection features elegant pieces including gold chain bracelets starting at $500. All pieces are carefully handcrafted. Want to see more?";
        } else {
            return [
                "We offer a stunning range of handcrafted accessories:\n\n" +
                "💎 Bracelets ($350-$500) - Various styles for both male & female\n" +
                "🎀 Luxury Scrunchies ($200) - Gentle on hair, beautiful designs\n" +
                "🎀 Silk Bows ($400) - Perfect for gifts and special occasions\n" +
                "💍 Jewelry ($500+) - Elegant gold chain pieces\n\n" +
                "All items are handcrafted with love and premium materials!",
                { type: 'quickReplies', options: ['View Shop Page', 'Check Prices', 'Shipping Info'] }
            ];
        }
    }
    
    // Check Prices / Pricing button
    if (msg.match(/\b(check.*price|pricing)\b/) || msg.includes('💰')) {
        return [
            "Our prices are very affordable! 💰\n\n" +
            "• Scrunchies: $200\n" +
            "• Bracelets: $350-$450\n" +
            "• Silk Bows: $400\n" +
            "• Jewelry: $500+\n\n" +
            "All prices are in Jamaican Dollars (JMD). Plus, we offer FREE shipping across Jamaica! 🚚✨",
            { type: 'quickReplies', options: ['View Products', 'Shipping Info', 'Contact Us'] }
        ];
    }
    
    // General Pricing questions
    if (msg.match(/\b(price|cost|expensive|cheap|afford|budget|much|pay)\b/) && !msg.includes('check')) {
        return [
            "Our prices are very affordable! 💰\n\n" +
            "• Scrunchies: $200\n" +
            "• Bracelets: $350-$450\n" +
            "• Silk Bows: $400\n" +
            "• Jewelry: $500+\n\n" +
            "All prices are in Jamaican Dollars (JMD). Plus, we offer FREE shipping across Jamaica! 🚚✨",
            { type: 'quickReplies', options: ['View Products', 'Shipping Info', 'Payment Methods'] }
        ];
    }
    
    // Shipping & Delivery
    if (msg.match(/\b(ship|deliver|delivery|shipping|transport|send|receive|location|address)\b/) || msg.includes('🚚')) {
        return [
            "Great news about shipping! 🚚✨\n\n" +
            "✅ FREE shipping on ALL orders across Jamaica\n" +
            "📦 Delivery Time:\n" +
            "  • Kingston & St. Andrew: 1-2 business days\n" +
            "  • Other parishes: 2-4 business days\n" +
            "📍 We ship to all 14 parishes in Jamaica\n" +
            "📬 Tracking: You'll receive updates via email/WhatsApp\n\n" +
            "Safe, secure, and completely FREE!",
            { type: 'quickReplies', options: ['View Shop Page', 'Check Prices', 'Contact Us'] }
        ];
    }
    
    // Orders & Tracking
    if (msg.match(/\b(order|track|tracking|status|where|when|arrive)\b/)) {
        if (currentUser) {
            return "To track your order: Go to your Profile → My Orders section. You'll see all order details and tracking status. Need help finding it?";
        } else {
            return [
                "To track your orders, please log in to your account first! 🔐\n\n" +
                "Once logged in, you can:\n" +
                "• View all your orders\n" +
                "• Track delivery status\n" +
                "• See order history\n" +
                "• Download invoices\n\n" +
                "Don't have an account yet? It takes just 30 seconds to create one!",
                { type: 'quickReplies', options: ['Login Now', 'Create Account', 'Guest Checkout'] }
            ];
        }
    }
    
    // Returns & Refunds
    if (msg.match(/\b(return|refund|exchange|replace|damaged|defect|wrong|money back)\b/)) {
        return [
            "Our Return Policy: ✅\n\n" +
            "📅 Return Window: 7 days from delivery\n" +
            "✨ Condition: Unused, original packaging\n" +
            "💰 Full refund or exchange available\n" +
            "❗ Note: Custom/personalized items cannot be returned\n\n" +
            "Damaged or defective items? We'll replace them immediately at no cost!\n\n" +
            "To start a return: Contact us via email or WhatsApp with your order number.",
            { type: 'quickReplies', options: ['Contact Support', 'Email Us', 'WhatsApp Us'] }
        ];
    }
    
    // Payment
    if (msg.match(/\b(pay|payment|accept|credit|debit|card|cash|method)\b/)) {
        return [
            "We accept multiple payment methods: 💳\n\n" +
            "✅ Credit/Debit Cards (Visa, MasterCard)\n" +
            "✅ Cash on Delivery (COD)\n" +
            "✅ Bank Transfer\n" +
            "✅ Mobile Money\n\n" +
            "All transactions are secure and encrypted. Your payment information is safe with us! 🔒",
            { type: 'quickReplies', options: ['Shop Now', 'Security Info', 'Contact Us'] }
        ];
    }
    
    // FAQ
    if (msg.match(/\bfaq\b/) || msg.includes('❓')) {
        return [
            "Here are our most frequently asked questions:\n\n" +
            "❓ What products do you offer?\n" +
            "❓ How much do items cost?\n" +
            "❓ Do you offer free shipping?\n" +
            "❓ What are your payment methods?\n" +
            "❓ Can I return items?\n" +
            "❓ Do you do custom orders?\n\n" +
            "Click below to learn more!",
            { type: 'quickReplies', options: ['🛍️ Browse Products', '💰 Check Prices', '🚚 Shipping Info', '📞 Contact Us'] }
        ];
    }
    
    // Contact Information
    if ((msg.match(/\b(contact|call|email|phone|whatsapp|reach|talk|speak|help|support)\b/) || msg.includes('📞')) && !msg.includes('faq') && !msg.includes('track') && !msg.includes('place')) {
        return [
            "I'm here to help! 💬 You can reach us through:\n\n" +
            "📧 Email: zoesacessories23@gmail.com\n" +
            "📱 WhatsApp: +1876-544-0766\n" +
            "🕐 Response Time: Usually within 1-2 hours\n\n" +
            "Feel free to message us anytime! We love hearing from our customers. 💖",
            { type: 'quickReplies', options: ['Email Us', 'WhatsApp Chat', 'View FAQ'] }
        ];
    }
    
    // Custom Orders
    if (msg.match(/\b(custom|personalize|special|unique|design|make|create)\b/)) {
        return [
            "We LOVE creating custom orders! 🎨✨\n\n" +
            "You can customize:\n" +
            "• Colors and patterns\n" +
            "• Size and length\n" +
            "• Bead combinations\n" +
            "• Personal engravings\n\n" +
            "💰 Custom orders start at $400\n" +
            "⏱️ Ready in 3-5 business days\n\n" +
            "Contact us via WhatsApp or email to discuss your custom design!",
            { type: 'quickReplies', options: ['WhatsApp Us', 'View Examples', 'Price Quote'] }
        ];
    }
    
    // Quality & Materials
    if (msg.match(/\b(quality|material|handmade|craft|make|durable|last)\b/)) {
        return "All our products are handcrafted with premium materials! 💎 We use high-quality beads, silk fabrics, and hypoallergenic metals. Each piece is made with care and inspected for quality. Your satisfaction is our priority!";
    }
    
    // Gift Ideas
    if (msg.match(/\b(gift|present|birthday|occasion|special|surprise)\b/)) {
        return [
            "Perfect gift ideas! 🎁💝\n\n" +
            "Popular gift choices:\n" +
            "🎀 Silk Bow Set ($400) - Elegant & versatile\n" +
            "💎 Bracelet Collection ($350) - Stylish for everyone\n" +
            "🎀 Luxury Scrunchie Pack ($200) - Practical & beautiful\n\n" +
            "✨ All items come beautifully packaged\n" +
            "💝 Gift wrapping available on request\n" +
            "💌 Include a personalized message for free!",
            { type: 'quickReplies', options: ['Browse Gifts', 'Gift Sets', 'Bulk Orders'] }
        ];
    }
    
    // Account & Profile
    if (msg.match(/\b(account|profile|register|signup|login|password|reset)\b/)) {
        if (!currentUser) {
            return [
                "Creating an account is quick and easy! 🔐\n\n" +
                "Benefits of having an account:\n" +
                "✅ Track your orders\n" +
                "✅ Save your favorite items\n" +
                "✅ Faster checkout\n" +
                "✅ Order history\n" +
                "✅ Exclusive offers\n\n" +
                "Ready to join the Zoie's family?",
                { type: 'quickReplies', options: ['Create Account', 'Login', 'Continue as Guest'] }
            ];
        } else {
            return `Welcome back, ${currentUser.username}! 😊 Your account is active. Need help with your profile settings or orders?`;
        }
    }
    
    // About Us
    if (msg.match(/\b(about|who|story|owner|founder|zoie)\b/)) {
        return "Zoie's Accessories is a Jamaican-based brand specializing in handcrafted accessories. Founded with love and passion for beautiful, quality pieces that make you feel special. Every item is made with care and attention to detail. We're proud to be 100% Jamaican! 🇯🇲💚💛";
    }
    
    // Bulk Orders
    if (msg.match(/\b(bulk|wholesale|quantity|many|lot|event|party)\b/)) {
        return [
            "We offer great discounts on bulk orders! 🎉\n\n" +
            "💼 Business/Wholesale Pricing Available\n" +
            "🎊 Perfect for events, parties, or gifts\n" +
            "📦 Minimum order: 10+ items\n" +
            "💰 Discounts: 10-20% off based on quantity\n\n" +
            "Contact us directly to discuss your bulk order requirements and get a custom quote!",
            { type: 'quickReplies', options: ['WhatsApp Us', 'Email Quote', 'View Catalog'] }
        ];
    }
    
    // Thanks & Positive Feedback
    if (msg.match(/\b(thank|thanks|appreciate|great|awesome|love|perfect|excellent)\b/)) {
        return "You're very welcome! 💖 We're so happy to help! Is there anything else you'd like to know about our products or services?";
    }
    
    // Bye/Goodbye
    if (msg.match(/\b(bye|goodbye|see you|later|exit|close)\b/)) {
        return "Thank you for chatting with us! 👋 Feel free to reach out anytime. Happy shopping at Zoie's Accessories! 💖✨";
    }
    
    // Default response with helpful suggestions
    return [
        "I'm here to help! 😊 I can assist you with:\n\n" +
        "🛍️ Product information & recommendations\n" +
        "💰 Pricing & payment methods\n" +
        "🚚 Shipping & delivery details\n" +
        "📦 Order tracking\n" +
        "↩️ Returns & refunds\n" +
        "🎨 Custom orders\n" +
        "📞 Contact information\n\n" +
        "What would you like to know more about?",
        { type: 'quickReplies', options: ['Browse Products', 'Shipping Info', 'Contact Us', 'Track Order'] }
    ];
}

// ========== PROFILE ==========
async function loadProfile() {
    if (!checkAuth()) return;
    
    // Fetch latest user data to ensure isAdmin is current
    try {
        const response = await fetch(`${API_URL}/auth/profile/${currentUser.token}`);
        const data = await response.json();
        if (data.success) {
            currentUser = { ...currentUser, ...data.data };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
    
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('displayUsername').textContent = currentUser.username;
    document.getElementById('displayEmail').textContent = currentUser.email;
    document.getElementById('memberSince').textContent = new Date(currentUser.joinedDate || Date.now()).toLocaleDateString();
    
    // Load profile picture
    const avatarImage = document.getElementById('avatarImage');
    if (avatarImage) {
        if (currentUser.profilePicture) {
            avatarImage.src = currentUser.profilePicture;
            avatarImage.style.display = 'block';
        } else {
            avatarImage.style.display = 'none';
        }
    }
    
    // Handle profile picture upload
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification('Please select an image file', 'error');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Image size must be less than 5MB', 'error');
                return;
            }
            
            // Convert to base64
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64Image = event.target.result;
                
                try {
                    // Update profile picture via API
                    const response = await fetch(`${API_URL}/auth/profile/${currentUser.token}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ profilePicture: base64Image })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        currentUser.profilePicture = base64Image;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        
                        // Update display
                        avatarImage.src = base64Image;
                        avatarImage.style.display = 'block';
                        updateUserUI();
                        
                        showNotification('Profile picture updated!', 'success');
                    } else {
                        showNotification(data.message || 'Failed to update profile picture', 'error');
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    showNotification('Failed to upload image', 'error');
                }
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Handle username update
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value.trim();
            
            if (!newUsername) {
                showNotification('Please enter a username', 'error');
                return;
            }
            
            try {
                const response = await fetch(`${API_URL}/auth/profile/${currentUser.token}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: newUsername })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    currentUser.username = newUsername;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Update display
                    document.getElementById('profileUsername').textContent = newUsername;
                    document.getElementById('displayUsername').textContent = newUsername;
                    updateUserUI();
                    
                    showNotification('Username updated!', 'success');
                    document.getElementById('newUsername').value = '';
                } else {
                    showNotification(data.message || 'Failed to update username', 'error');
                }
            } catch (error) {
                console.error('Update error:', error);
                showNotification('Failed to update username', 'error');
            }
        });
    }
}

// Profile tabs
function initProfileTabs() {
    const navLinks = document.querySelectorAll('.profile-nav-link');
    const tabs = document.querySelectorAll('.profile-tab');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.id === 'logoutBtn') return;
            
            e.preventDefault();
            const tabName = link.dataset.tab;
            
            navLinks.forEach(l => l.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            
            link.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// ========== NOTIFICATIONS ==========
function showNotification(message, type = 'info') {
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

// ========== WELCOME ANIMATION ==========
function showWelcomeAnimation(username) {
    const overlay = document.getElementById('welcomeOverlay');
    const message = document.querySelector('.welcome-message');
    
    if (!overlay) return;
    
    if (message && username) {
        message.textContent = `Welcome back, ${username}!`;
    }
    
    overlay.classList.add('active');
    
    setTimeout(() => {
        overlay.style.animation = 'fadeIn 0.5s ease reverse';
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.style.animation = '';
        }, 500);
    }, 3000);
}

// ========== PASSWORD TOGGLE ==========
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });


});

// ========== CARD NUMBER FORMATTING ==========
const cardNumber = document.getElementById('cardNumber');
if (cardNumber) {
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
}

const cardExpiry = document.getElementById('cardExpiry');
if (cardExpiry) {
    cardExpiry.addEventListener('input', function(e) {
        // Removed chatbotToggle logic, replaced by FAB logic below
        const chatbotContainer = document.getElementById('chatbotContainer'); 
        const chatbotClose = document.getElementById('chatbotClose'); 
        const chatbotSend = document.getElementById('chatbotSend'); 
        const chatbotInput = document.getElementById('chatbotInput'); 
        // Floating Action Button (FAB) for chatbot
        let fab = document.getElementById('chatbotFab');
        if (!fab) {
            fab = document.createElement('button');
            fab.className = 'chatbot-fab';
            fab.id = 'chatbotFab';
            fab.title = 'Chat with us!';
            fab.innerHTML = '<span style="font-size:1.6em;">💬</span>';
            document.body.appendChild(fab);
        }
        // Show chat window, hide FAB
        fab.addEventListener('click', function() {
            chatbotContainer.classList.add('active');
            fab.style.display = 'none';
            if (typeof showWelcomeMessage === 'function' && !window.chatbotInitialized) {
                showWelcomeMessage();
                window.chatbotInitialized = true;
            }
        });
        // Hide chat window, show FAB
        function closeChatbot() {
            chatbotContainer.classList.remove('active');
            fab.style.display = 'flex';
        }
        if (chatbotClose) {
            chatbotClose.addEventListener('click', closeChatbot);
        }
        // Fallback: click outside chat window closes it
        if (chatbotContainer) {
            chatbotContainer.addEventListener('click', function(e) {
                if (e.target === chatbotContainer) {
                    closeChatbot();
                }
            });
        }
        // On load, hide chat window, show FAB
        chatbotContainer.classList.remove('active');
        fab.style.display = 'flex';
        const reviewForm = document.getElementById('reviewForm');
        if (chatbotClose) { 
            chatbotClose.addEventListener('click', () => { 
                chatbotContainer.classList.remove('active'); 
            }); 
        } 
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (chatbotSend) { 
            chatbotSend.addEventListener('click', sendChatMessage); 
        } 
        showNotification('Your cart is empty!', 'error');
        if (chatbotInput) { 
            chatbotInput.addEventListener('keypress', (e) => { 
                if (e.key === 'Enter') sendChatMessage(); 
            }); 
        } 
    }); // <-- Added missing closing brace here
}

const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(checkoutForm);
        const orderData = {
            customer: {
                name: `${formData.get('firstName')} ${formData.get('lastName')}`,
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                parish: formData.get('parish')
            },
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            orderDate: new Date().toISOString(),
            orderNumber: 'ORD-' + Date.now()
        };
        
        // Send email notifications
        await sendOrderEmails(orderData);
        
        showNotification('Order placed successfully! You will receive a confirmation email.', 'success');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        setTimeout(() => window.location.href = 'index.html', 2000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded on:', window.location.pathname);
    console.log('Current user on page load:', currentUser);
    updateCartCount();
    updateUserUI();
    initStarRating();
    initProfileTabs();

    // Page-specific initialization
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        loadProducts();
    }

    if (window.location.pathname.includes('shop.html')) {
        loadShopProducts();
        initShopFilters();
    }

    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }

    if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutSummary();
        // Show/hide bank transfer details on payment method change (checkout page)
        var bankRadio = document.getElementById('bankRadio');
        var cashRadio = document.getElementById('cashRadio');
        var bankDetails = document.getElementById('bankTransferDetails');
        if (bankRadio && cashRadio && bankDetails) {
            function toggleBankDetails() {
                if (bankRadio.checked) {
                    bankDetails.style.display = 'block';
                } else {
                    bankDetails.style.display = 'none';
                }
            }
            bankRadio.addEventListener('change', toggleBankDetails);
            cashRadio.addEventListener('change', toggleBankDetails);
            // Show by default if bank is selected
            toggleBankDetails();
        }
    }

    if (window.location.pathname.includes('reviews.html')) {
        loadReviews();
    }

    if (window.location.pathname.includes('profile.html')) {
        loadProfile();
    }
});

// ========== DEMO LOGIN/REGISTER (FRONTEND ONLY) ========== 
// Store demo users in localStorage
function getDemoUsers() {
    return JSON.parse(localStorage.getItem('demoUsers')) || [];
}
function saveDemoUsers(users) {
    localStorage.setItem('demoUsers', JSON.stringify(users));
}
function demoRegister(email, password, username) {
    let users = getDemoUsers();
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email already registered.' };
    }
    const newUser = { email, password, username: username || email.split('@')[0] };
    users.push(newUser);
    saveDemoUsers(users);
    return { success: true, user: newUser };
}
function demoLogin(email, password) {
    let users = getDemoUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, message: 'Invalid email or password.' };
}
function demoLogout() {
    localStorage.removeItem('currentUser');
}

// Intercept login/register forms
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    const loginForm = document.querySelector('form#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value.trim();
            const password = loginForm.querySelector('input[type="password"]').value;
            const result = demoLogin(email, password);
            const errorDiv = document.getElementById('loginError');
            if (result.success) {
                window.location.href = 'index.html';
            } else {
                if (errorDiv) errorDiv.textContent = result.message;
            }
        });
    }
    // Register form
    const registerForm = document.querySelector('form#registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = registerForm.querySelector('input[type="email"]').value.trim();
            const password = registerForm.querySelector('input[type="password"]').value;
            const username = registerForm.querySelector('input[name="username"]')?.value.trim() || email.split('@')[0];
            const result = demoRegister(email, password, username);
            const errorDiv = document.getElementById('registerError');
            if (result.success) {
                window.location.href = 'login.html';
            } else {
                if (errorDiv) errorDiv.textContent = result.message;
            }
        });
    }
});
        
