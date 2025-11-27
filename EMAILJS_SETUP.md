# 📧 EmailJS Setup Guide for Zoie's Accessories

## Why EmailJS?
EmailJS allows you to send emails directly from your website without needing a backend server. It's:
- ✅ **Free** (up to 200 emails/month)
- ✅ **Easy** to set up (5 minutes)
- ✅ **Reliable** - works every time
- ✅ **No backend needed** - works directly from JavaScript

---

## 🚀 Step-by-Step Setup

### Step 1: Create EmailJS Account

1. Go to **https://www.emailjs.com/**
2. Click **"Sign Up"** (top right)
3. Sign up using your Gmail: **zoesacessories23@gmail.com**
4. Verify your email address

---

### Step 2: Connect Your Gmail Account

1. After logging in, go to **"Email Services"** (left sidebar)
2. Click **"Add New Service"**
3. Select **"Gmail"**
4. Click **"Connect Account"**
5. Sign in with **zoesacessories23@gmail.com**
6. Allow EmailJS to access your Gmail
7. Give your service a name: **`service_zoies`**
8. Click **"Create Service"**

> 💡 **Note:** The Service ID `service_zoies` is used in your code. Keep it as is or update the code if you change it.

---

### Step 3: Create Email Template for CUSTOMERS

1. Go to **"Email Templates"** (left sidebar)
2. Click **"Create New Template"**
3. Template Name: **`template_customer`**
4. In the **Subject** field, enter:
   ```
   Order Confirmation - {{order_number}} ✨
   ```
5. In the **Content** tab, switch to **"HTML"** mode (toggle in the editor)
6. **Delete all existing content** and paste this:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #ff1493 0%, #ff69b4 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                ✨ Zoie's Accessories
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                                Handcrafted with Love 💖
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Success Badge -->
                    <tr>
                        <td align="center" style="padding: 30px 30px 20px 30px;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #34d058 100%); color: white; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
                                ✓ Order Confirmed!
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p style="margin: 0 0 20px 0; color: #333; font-size: 18px; line-height: 1.6;">
                                Hi <strong style="color: #ff1493;">{{to_name}}</strong>,
                            </p>
                            <p style="margin: 0 0 25px 0; color: #555; font-size: 16px; line-height: 1.6;">
                                Thank you for your order! We're excited to handcraft your beautiful accessories. 🎀
                            </p>
                            
                            <!-- Order Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fff0f8 0%, #ffe6f2 100%); border-radius: 15px; padding: 25px; margin: 25px 0; border: 2px solid #ff69b4;">
                                <tr>
                                    <td>
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #ff1493; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                                    📦 Order Number
                                                </td>
                                                <td align="right" style="color: #333; font-weight: 600; font-size: 16px;">
                                                    {{order_number}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #ff1493; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; padding-top: 10px;">
                                                    📅 Order Date
                                                </td>
                                                <td align="right" style="color: #555; font-size: 15px; padding-top: 10px;">
                                                    {{order_date}}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Items Ordered -->
                            <h2 style="color: #ff1493; font-size: 20px; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 3px solid #ff69b4;">
                                💎 Your Items
                            </h2>
                            <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 15px 0; border-left: 4px solid #ff1493;">
                                <pre style="margin: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #333; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">{{items_list}}</pre>
                            </div>
                            
                            <!-- Total -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                    <td align="right">
                                        <div style="display: inline-block; background: linear-gradient(135deg, #ff1493 0%, #ff69b4 100%); color: white; padding: 15px 30px; border-radius: 10px; font-size: 20px; font-weight: 700; box-shadow: 0 4px 15px rgba(255, 20, 147, 0.3);">
                                            Total: {{total}}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Shipping Address -->
                            <h2 style="color: #ff1493; font-size: 20px; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 3px solid #ff69b4;">
                                🚚 Shipping Address
                            </h2>
                            <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%); border-radius: 10px; padding: 20px; margin: 15px 0; border-left: 4px solid #17a2b8;">
                                <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.8;">
                                    {{shipping_address}}
                                </p>
                            </div>
                            
                            <!-- What's Next -->
                            <div style="background: linear-gradient(135deg, #fff9e6 0%, #fff3d4 100%); border-radius: 15px; padding: 25px; margin: 30px 0; border: 2px dashed #ffc107;">
                                <h3 style="margin: 0 0 15px 0; color: #f57c00; font-size: 18px;">
                                    📬 What Happens Next?
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 15px; line-height: 1.8;">
                                    <li style="margin-bottom: 10px;">✅ Your order is being prepared</li>
                                    <li style="margin-bottom: 10px;">📦 We'll notify you when it ships</li>
                                    <li style="margin-bottom: 10px;">🚚 Track updates via email & WhatsApp</li>
                                    <li>💝 Delivery in 1-4 business days</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Contact Section -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px 40px; text-align: center;">
                            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">
                                Need Help? We're Here! 💬
                            </h3>
                            <p style="margin: 0 0 15px 0; color: #555; font-size: 14px;">
                                📧 zoesacessories23@gmail.com<br>
                                📱 WhatsApp: +1876-544-0766
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 30px 40px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                                Thank you for supporting Zoie's Accessories! 💖
                            </p>
                            <p style="margin: 0; color: #ecf0f1; font-size: 13px; opacity: 0.9;">
                                100% Handcrafted in Jamaica 🇯🇲 | Made with Love & Care
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

7. In the **"To email"** field, enter: `{{to_email}}`
8. Click **"Save"**

---

### Step 4: Create Email Template for ADMIN

1. Click **"Create New Template"** again
2. Template Name: **`template_admin`**
3. In the **Subject** field, enter:
   ```
   🔔 New Order Alert - {{order_number}}
   ```
4. Switch to **"HTML"** mode
5. **Delete all existing content** and paste this:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                👑 ADMIN DASHBOARD
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                                Zoie's Accessories
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Alert Badge -->
                    <tr>
                        <td align="center" style="padding: 30px 30px 20px 30px;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);">
                                🔔 NEW ORDER RECEIVED!
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <div style="background: linear-gradient(135deg, #fff4e6 0%, #ffe8cc 100%); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #f57c00;">
                                <h2 style="margin: 0 0 15px 0; color: #e65100; font-size: 20px;">
                                    ⚡ Action Required
                                </h2>
                                <p style="margin: 0; color: #666; font-size: 15px; line-height: 1.6;">
                                    A new customer order has been placed and requires your attention.
                                </p>
                            </div>
                            
                            <!-- Order Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #e8f4f8 0%, #d4e9f2 100%); border-radius: 15px; padding: 25px; margin: 25px 0; border: 2px solid #17a2b8;">
                                <tr>
                                    <td>
                                        <table width="100%" cellpadding="10" cellspacing="0">
                                            <tr>
                                                <td style="color: #0c5460; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                                    📦 Order Number
                                                </td>
                                                <td align="right" style="color: #333; font-weight: 700; font-size: 18px;">
                                                    {{order_number}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #0c5460; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                                    📅 Order Date
                                                </td>
                                                <td align="right" style="color: #555; font-size: 15px;">
                                                    {{order_date}}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Customer Information -->
                            <h2 style="color: #6c5ce7; font-size: 20px; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 3px solid #a29bfe;">
                                👤 Customer Information
                            </h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 15px 0;">
                                <tr>
                                    <td>
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #666; font-size: 14px; width: 140px;">
                                                    <strong>Name:</strong>
                                                </td>
                                                <td style="color: #333; font-size: 15px; font-weight: 600;">
                                                    {{customer_name}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666; font-size: 14px;">
                                                    <strong>Email:</strong>
                                                </td>
                                                <td style="color: #17a2b8; font-size: 15px;">
                                                    <a href="mailto:{{customer_email}}" style="color: #17a2b8; text-decoration: none;">{{customer_email}}</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666; font-size: 14px;">
                                                    <strong>Phone:</strong>
                                                </td>
                                                <td style="color: #28a745; font-size: 15px; font-weight: 600;">
                                                    {{customer_phone}}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Items Ordered -->
                            <h2 style="color: #6c5ce7; font-size: 20px; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 3px solid #a29bfe;">
                                📋 Order Details
                            </h2>
                            <div style="background: linear-gradient(135deg, #fff9e6 0%, #fff3d4 100%); border-radius: 10px; padding: 20px; margin: 15px 0; border-left: 4px solid #ffc107;">
                                <pre style="margin: 0; font-family: 'Consolas', 'Monaco', monospace; color: #333; font-size: 14px; line-height: 1.9; white-space: pre-wrap; font-weight: 500;">{{items_list}}</pre>
                            </div>
                            
                            <!-- Total Amount -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                    <td align="right">
                                        <div style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #34d058 100%); color: white; padding: 18px 35px; border-radius: 12px; font-size: 22px; font-weight: 700; box-shadow: 0 4px 20px rgba(40, 167, 69, 0.4);">
                                            💰 Total: {{total}}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Shipping Address -->
                            <h2 style="color: #6c5ce7; font-size: 20px; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 3px solid #a29bfe;">
                                🚚 Delivery Address
                            </h2>
                            <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 10px; padding: 20px; margin: 15px 0; border-left: 4px solid #28a745;">
                                <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.8; font-weight: 500;">
                                    📍 {{shipping_address}}
                                </p>
                            </div>
                            
                            <!-- Action Items -->
                            <div style="background: linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%); border-radius: 15px; padding: 25px; margin: 30px 0; border: 2px dashed #dc3545;">
                                <h3 style="margin: 0 0 15px 0; color: #c82333; font-size: 18px; font-weight: 700;">
                                    ✅ Next Steps
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 15px; line-height: 1.9;">
                                    <li style="margin-bottom: 10px;">1️⃣ Verify order details above</li>
                                    <li style="margin-bottom: 10px;">2️⃣ Begin preparing items for shipment</li>
                                    <li style="margin-bottom: 10px;">3️⃣ Contact customer if needed: {{customer_phone}}</li>
                                    <li>4️⃣ Update order status in admin dashboard</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Quick Actions -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                            <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px;">
                                Quick Contact
                            </h3>
                            <p style="margin: 0; color: #ffffff; font-size: 14px; opacity: 0.95;">
                                📧 <a href="mailto:{{customer_email}}" style="color: #ffffff; text-decoration: underline;">Email Customer</a><br>
                                📱 WhatsApp: {{customer_phone}}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 25px 40px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 15px; font-weight: 600;">
                                Zoie's Accessories Admin Panel 👑
                            </p>
                            <p style="margin: 0; color: #ecf0f1; font-size: 12px; opacity: 0.9;">
                                This is an automated notification from your order system
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

6. In the **"To email"** field, enter: `{{to_email}}`
7. Click **"Save"**

---

### Step 5: Get Your Public Key

1. Go to **"Account"** (left sidebar) or click your profile
2. Look for **"API Keys"** section
3. Copy your **Public Key** (it looks like: `YOUR_PUBLIC_KEY_HERE`)

---

### Step 6: Update Your Website Code

1. Open `checkout.html` in your editor
2. Find this line:
   ```javascript
   emailjs.init('YOUR_PUBLIC_KEY');
   ```
3. Replace `YOUR_PUBLIC_KEY` with the actual key you copied
4. Save the file

**Example:**
```javascript
emailjs.init('u9Xj5kL8mN2pQ4rT6vY');  // Replace with your actual key
```

---

### Step 7: Verify Template IDs Match

Make sure your template IDs in EmailJS match what's in the code:

**In EmailJS Dashboard:**
- Customer Template ID: `template_customer`
- Admin Template ID: `template_admin`
- Service ID: `service_zoies`

**In your `script.js` file (already set up):**
```javascript
await emailjs.send('service_zoies', 'template_customer', {...});
await emailjs.send('service_zoies', 'template_admin', {...});
```

✅ They match! No code changes needed.

---

## 🧪 Testing Your Setup

1. **Open your website** in a browser
2. **Add items to cart**
3. **Go to checkout**
4. **Fill in the form** with a test email (use your personal email)
5. **Submit the order**
6. **Check both inboxes:**
   - Your test email (customer confirmation)
   - zoesacessories23@gmail.com (admin notification)

---

## 📊 Free Tier Limits

EmailJS Free Plan includes:
- ✅ **200 emails/month** (enough for 100 orders)
- ✅ Unlimited templates
- ✅ 2 email services
- ✅ EmailJS branding in footer

💡 **Need more?** Upgrade to Personal ($15/month) for 1000 emails.

---

## 🔧 Troubleshooting

### Emails not sending?
1. Check browser console for errors (F12)
2. Verify your Public Key is correct
3. Make sure template IDs match exactly
4. Check EmailJS dashboard for error logs

### Template variables not showing?
1. Double-check variable names use double curly braces: `{{variable_name}}`
2. Verify you're passing the correct variable names from JavaScript

### Gmail blocking emails?
1. Check your Gmail spam folder
2. Make sure you connected Gmail correctly in Email Services
3. Try disconnecting and reconnecting your Gmail account

---

## 📝 Template Variables Reference

### Customer Email Variables:
- `{{to_email}}` - Customer's email address
- `{{to_name}}` - Customer's name
- `{{order_number}}` - Order number (e.g., ORD-1234567890)
- `{{order_date}}` - Date order was placed
- `{{items_list}}` - List of ordered items
- `{{total}}` - Total amount in JMD
- `{{shipping_address}}` - Full shipping address

### Admin Email Variables:
- `{{to_email}}` - Admin email (zoesacessories23@gmail.com)
- `{{order_number}}` - Order number
- `{{order_date}}` - Date order was placed
- `{{customer_name}}` - Customer's name
- `{{customer_email}}` - Customer's email
- `{{customer_phone}}` - Customer's phone
- `{{items_list}}` - List of ordered items
- `{{total}}` - Total amount in JMD
- `{{shipping_address}}` - Delivery address

---

## ✅ Setup Complete!

Your email system is now fully operational! Every order will automatically:
1. ✉️ Send a beautiful confirmation email to the customer
2. ✉️ Send an order notification to you (admin)
3. 💾 Save the order in localStorage for your admin dashboard

**Need help?** Check the EmailJS documentation: https://www.emailjs.com/docs/

---

## 🎨 Customizing Email Templates

Want to change colors or add your logo?

1. Go to EmailJS Dashboard → Email Templates
2. Click on the template you want to edit
3. Modify the HTML code
4. Use the **"Test"** button to preview your changes
5. Save when happy

**Tips:**
- Keep the `{{variable}}` placeholders intact
- Test emails after making changes
- Use inline CSS (no external stylesheets)

---

**Made with 💖 for Zoie's Accessories**
