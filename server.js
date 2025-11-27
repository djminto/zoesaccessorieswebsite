// ==========================================
// ZOIE'S ACCESSORIES - NODE.JS SERVER
// Simple backend for user authentication
// ==========================================

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

// Ensure data directory exists
async function ensureDataDirectory() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(USERS_FILE, '[]');
        await fs.writeFile(ORDERS_FILE, '[]');
        await fs.writeFile(REVIEWS_FILE, '[]');
    }
}

// Helper functions
async function readJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeJSON(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// ========== AUTHENTICATION ROUTES ==========

// Register new user
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Read existing users
        const users = await readJSON(USERS_FILE);

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            username,
            email,
            password: hashPassword(password),
            profilePicture: '',
            joinedDate: new Date().toISOString(),
            token: generateToken()
        };

        users.push(newUser);
        await writeJSON(USERS_FILE, users);

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.json({ 
            success: true, 
            message: 'Registration successful',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt:', { email, passwordLength: password?.length });

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Read users
        const users = await readJSON(USERS_FILE);
        console.log('Total users in database:', users.length);

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Verify password
        const hashedPassword = hashPassword(password);
        console.log('Password match:', user.password === hashedPassword);
        
        if (user.password !== hashedPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Generate new token
        user.token = generateToken();
        await writeJSON(USERS_FILE, users);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Get user profile
app.get('/api/profile/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const users = await readJSON(USERS_FILE);
        
        const user = users.find(u => u.token === token);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Update user profile
app.put('/api/profile/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { username, email, currentPassword, newPassword } = req.body;
        
        const users = await readJSON(USERS_FILE);
        const userIndex = users.findIndex(u => u.token === token);
        
        if (userIndex === -1) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }

        // Update username and email
        if (username) users[userIndex].username = username;
        if (email) users[userIndex].email = email;

        // Update password if provided
        if (currentPassword && newPassword) {
            if (users[userIndex].password !== hashPassword(currentPassword)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Current password is incorrect' 
                });
            }
            users[userIndex].password = hashPassword(newPassword);
        }

        await writeJSON(USERS_FILE, users);

        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// ========== ORDERS ROUTES ==========

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { token, order } = req.body;
        
        // Verify user
        const users = await readJSON(USERS_FILE);
        const user = users.find(u => u.token === token);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized' 
            });
        }

        const orders = await readJSON(ORDERS_FILE);
        
        const newOrder = {
            id: Date.now(),
            userId: user.id,
            customerName: order.customerName,
            email: order.email,
            phone: order.phone,
            address: order.address,
            parish: order.parish,
            items: order.items,
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
            status: 'pending',
            date: new Date().toISOString()
        };

        orders.push(newOrder);
        await writeJSON(ORDERS_FILE, orders);

        res.json({ 
            success: true, 
            message: 'Order placed successfully',
            order: newOrder 
        });
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Get user orders
app.get('/api/orders/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const users = await readJSON(USERS_FILE);
        const user = users.find(u => u.token === token);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized' 
            });
        }

        const orders = await readJSON(ORDERS_FILE);
        const userOrders = orders.filter(o => o.userId === user.id);

        res.json({ success: true, orders: userOrders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Get all orders (admin)
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await readJSON(ORDERS_FILE);
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// ========== REVIEWS ROUTES ==========

// Create review
app.post('/api/reviews', async (req, res) => {
    try {
        const { name, email, rating, message } = req.body;

        const reviews = await readJSON(REVIEWS_FILE);
        
        const newReview = {
            id: Date.now(),
            name,
            email,
            rating,
            message,
            date: new Date().toISOString()
        };

        reviews.push(newReview);
        await writeJSON(REVIEWS_FILE, reviews);

        res.json({ 
            success: true, 
            message: 'Review submitted successfully',
            review: newReview 
        });
    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Get all reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await readJSON(REVIEWS_FILE);
        res.json({ success: true, reviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Delete review (admin)
app.delete('/api/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await readJSON(REVIEWS_FILE);
        
        const filteredReviews = reviews.filter(r => r.id !== parseInt(id));
        await writeJSON(REVIEWS_FILE, filteredReviews);

        res.json({ 
            success: true, 
            message: 'Review deleted successfully' 
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Start server
async function startServer() {
    await ensureDataDirectory();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📂 Data directory: ${DATA_DIR}`);
        console.log(`✨ Zoie's Accessories API is ready!`);
    });
}

startServer();
