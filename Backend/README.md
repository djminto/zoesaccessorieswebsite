# Zoie's Accessories - C# Backend Setup

## Prerequisites
1. .NET 8.0 SDK installed
2. MySQL Server installed and running
3. VS Code Live Server extension installed

## MySQL Database Setup

### 1. Install MySQL (if not already installed)
Download from: https://dev.mysql.com/downloads/mysql/

### 2. Create Database and Configure Connection
Open MySQL Workbench or MySQL command line and run:

```sql
CREATE DATABASE zoies_db;
USE zoies_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(64) NOT NULL,
    token VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Update Connection String
Edit `Backend/appsettings.json` and update the MySQL password:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=zoies_db;User=root;Password=YOUR_MYSQL_PASSWORD_HERE;"
}
```

## Running the Application

### Start the C# API Server

1. Open terminal in VS Code
2. Navigate to Backend folder:
   ```powershell
   cd Backend
   ```

3. Restore packages:
   ```powershell
   dotnet restore
   ```

4. Run the server:
   ```powershell
   dotnet run
   ```

The API will start on **http://localhost:5000**

### Start Live Server for Frontend

1. Open any HTML file (like `index.html`) in VS Code
2. Right-click and select "Open with Live Server"
3. Or click the "Go Live" button in the status bar

Live Server will run on **http://127.0.0.1:5500**

## Testing the Setup

1. Make sure MySQL is running
2. Start the C# API server (port 5000)
3. Start VS Code Live Server (port 5500)
4. Open **http://127.0.0.1:5500/register.html**
5. Create a test account
6. Try logging in at **http://127.0.0.1:5500/login.html**

## API Endpoints

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/profile/{token}` - Get user profile

## Troubleshooting

### Connection Error
- Make sure the C# API server is running on port 5000
- Check the console for any errors

### MySQL Connection Failed
- Verify MySQL is running
- Check the connection string in `appsettings.json`
- Ensure the password is correct

### CORS Error
- The API is configured to accept requests from Live Server (port 5500)
- If using a different port, update the CORS policy in `Program.cs`

## Project Structure

```
Zoie's Website/
├── Backend/                    # C# ASP.NET Web API
│   ├── Controllers/
│   │   └── AuthController.cs  # Authentication endpoints
│   ├── Models/
│   │   └── User.cs            # User models
│   ├── Services/
│   │   └── DatabaseService.cs # MySQL connection
│   ├── Program.cs             # API configuration
│   ├── appsettings.json       # Configuration
│   └── ZoiesAPI.csproj       # Project file
├── login.html                 # Login page
├── register.html              # Registration page
├── index.html                 # Homepage
└── Style.css                  # Styles
```

## Development Workflow

1. **Backend Development**: Make changes to C# files in `Backend/` folder
2. **Frontend Development**: Edit HTML/CSS/JS files in root folder
3. **Testing**: Use Live Server for instant preview
4. **Database**: Use MySQL Workbench to view/manage data

Enjoy building with Zoie's Accessories! 💖
