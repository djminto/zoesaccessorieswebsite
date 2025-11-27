# Zoie's Accessories - E-Commerce Website

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Node.js dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

The server will start on http://localhost:3000

3. **Open the website:**
   - Open `index.html` in your browser
   - Or use Live Server extension in VS Code

## 📁 Database Structure

The database uses JSON files stored in the `data` folder:

### users.json
Stores user accounts with the following structure:
```json
{
  "id": 1234567890,
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "profilePicture": "",
  "joinedDate": "2025-11-25T10:00:00.000Z",
  "token": "authentication_token"
}
```

### orders.json
Stores customer orders:
```json
{
  "id": 1234567890,
  "userId": 1234567890,
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "+1876-555-0123",
  "address": "123 Main St",
  "parish": "Kingston",
  "items": [],
  "subtotal": 1000,
  "tax": 150,
  "total": 1150,
  "status": "pending",
  "date": "2025-11-25T10:00:00.000Z"
}
```

### reviews.json
Stores customer reviews:
```json
{
  "id": 1234567890,
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "message": "Great products!",
  "date": "2025-11-25T10:00:00.000Z"
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/profile/:token` - Get user profile
- `PUT /api/profile/:token` - Update user profile

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:token` - Get user orders
- `GET /api/admin/orders` - Get all orders (admin)

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews` - Get all reviews
- `DELETE /api/reviews/:id` - Delete review (admin)

## 🛠️ Development

For development with auto-reload:
```bash
npm run dev
```

## 📦 Project Structure
```
Zoie's Website/
├── data/                    # Database JSON files
│   ├── users.json
│   ├── orders.json
│   └── reviews.json
├── Image/                   # Product images
├── index.html              # Home page
├── shop.html               # Shop page
├── cart.html               # Shopping cart
├── checkout.html           # Checkout page
├── profile.html            # User profile
├── reviews.html            # Reviews page
├── login.html              # Login page
├── register.html           # Registration page
├── admin.html              # Admin dashboard
├── Style.css               # Main stylesheet
├── script.js               # Main JavaScript
├── admin.js                # Admin JavaScript
├── server.js               # Node.js backend server
├── package.json            # Node.js dependencies
└── README.md               # This file
```

## 🔐 Security Notes

This is a development setup using:
- JSON files for data storage
- SHA-256 password hashing
- Token-based authentication

**For production, consider:**
- Using a proper database (MongoDB, PostgreSQL, etc.)
- Implementing bcrypt for password hashing
- Adding JWT tokens with expiration
- Setting up HTTPS
- Adding rate limiting
- Implementing input validation and sanitization

## 📧 Contact

Email: zoesacessories23@gmail.com  
WhatsApp: +1876-544-0766  
Instagram: @zoe._accessories

---

Made with ❤️ by Zoie's Accessories
