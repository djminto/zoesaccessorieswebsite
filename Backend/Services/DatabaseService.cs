using Microsoft.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

namespace ZoiesAPI.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;
        private readonly string _masterConnectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException("Connection string not found");
            
            // Create master connection string for database creation
            _masterConnectionString = _connectionString.Replace("Database=zoies_db;", "Database=master;");
        }

        public SqlConnection GetConnection()
        {
            return new SqlConnection(_connectionString);
        }

        public SqlConnection GetMasterConnection()
        {
            return new SqlConnection(_masterConnectionString);
        }

        public static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes).ToLower();
        }

        public static string GenerateToken()
        {
            return Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLower();
        }

        public async Task InitializeDatabase()
        {
            try
            {
                // First, create the database if it doesn't exist
                using (var masterConnection = GetMasterConnection())
                {
                    await masterConnection.OpenAsync();
                    
                    var createDbCommand = @"
                        IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'zoies_db')
                        BEGIN
                            CREATE DATABASE zoies_db;
                        END
                    ";

                    using var cmd1 = new SqlCommand(createDbCommand, masterConnection);
                    await cmd1.ExecuteNonQueryAsync();
                    Console.WriteLine("✅ Database 'zoies_db' created/verified");
                }

                // Now create the table in the zoies_db database
                using (var connection = GetConnection())
                {
                    await connection.OpenAsync();

                    var createTableCommand = @"
                        IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
                        BEGIN
                            CREATE TABLE users (
                                id INT IDENTITY(1,1) PRIMARY KEY,
                                username NVARCHAR(100) NOT NULL,
                                email NVARCHAR(255) NOT NULL UNIQUE,
                                password_hash NVARCHAR(64) NOT NULL,
                                token NVARCHAR(64) NOT NULL,
                                profile_picture NVARCHAR(MAX) NULL,
                                is_admin BIT DEFAULT 0,
                                created_at DATETIME2 DEFAULT GETDATE()
                            );
                        END
                        ELSE
                        BEGIN
                            -- Add email column if it doesn't exist (for old tables)
                            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'users') AND name = 'email')
                            BEGIN
                                ALTER TABLE users ADD email NVARCHAR(255) NULL;
                                -- Make it unique after adding
                                CREATE UNIQUE INDEX IX_users_email ON users(email) WHERE email IS NOT NULL;
                            END
                            
                            -- Add username column if it doesn't exist
                            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'users') AND name = 'username')
                            BEGIN
                                ALTER TABLE users ADD username NVARCHAR(100) NULL;
                            END
                            
                            -- Add password_hash column if it doesn't exist
                            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'users') AND name = 'password_hash')
                            BEGIN
                                ALTER TABLE users ADD password_hash NVARCHAR(64) NULL;
                            END
                            
                            -- Add token column if it doesn't exist
                            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'users') AND name = 'token')
                            BEGIN
                                ALTER TABLE users ADD token NVARCHAR(64) NULL;
                            END
                            
                            -- Add profile_picture column if it doesn't exist
                            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'users') AND name = 'profile_picture')
                            BEGIN
                                ALTER TABLE users ADD profile_picture NVARCHAR(MAX) NULL;
                            END
                            
                            -- Add is_admin column if it doesn't exist
                            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'users') AND name = 'is_admin')
                            BEGIN
                                ALTER TABLE users ADD is_admin BIT DEFAULT 0;
                            END
                            
                            -- Add created_at column if it doesn't exist
                            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'users') AND name = 'created_at')
                            BEGIN
                                ALTER TABLE users ADD created_at DATETIME2 DEFAULT GETDATE();
                            END
                        END
                    ";

                    using var cmd2 = new SqlCommand(createTableCommand, connection);
                    await cmd2.ExecuteNonQueryAsync();
                    Console.WriteLine("✅ Table 'users' created/verified");
                }

                Console.WriteLine("✅ Database initialized successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Database initialization error: {ex.Message}");
                throw;
            }
        }
    }
}
