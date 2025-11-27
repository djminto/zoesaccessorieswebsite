using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ZoiesAPI.Models;
using ZoiesAPI.Services;

namespace ZoiesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DatabaseService _dbService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
        {
            _dbService = new DatabaseService(configuration);
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                _logger.LogInformation($"Registration attempt for: {request.Email}");

                if (string.IsNullOrWhiteSpace(request.Username) || 
                    string.IsNullOrWhiteSpace(request.Email) || 
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "All fields are required" 
                    });
                }

                using var connection = _dbService.GetConnection();
                await connection.OpenAsync();

                // Check if user already exists
                var checkQuery = "SELECT COUNT(*) FROM users WHERE email = @Email";
                using var checkCmd = new SqlCommand(checkQuery, connection);
                checkCmd.Parameters.AddWithValue("@Email", request.Email);
                var count = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());

                if (count > 0)
                {
                    return BadRequest(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "Email already registered" 
                    });
                }

                // Create new user
                var passwordHash = DatabaseService.HashPassword(request.Password);
                var token = DatabaseService.GenerateToken();

                var insertQuery = @"
                    INSERT INTO users (username, email, password_hash, token) 
                    VALUES (@Username, @Email, @PasswordHash, @Token);
                    SELECT CAST(SCOPE_IDENTITY() as int);
                ";

                using var insertCmd = new SqlCommand(insertQuery, connection);
                insertCmd.Parameters.AddWithValue("@Username", request.Username);
                insertCmd.Parameters.AddWithValue("@Email", request.Email);
                insertCmd.Parameters.AddWithValue("@PasswordHash", passwordHash);
                insertCmd.Parameters.AddWithValue("@Token", token);

                var userId = Convert.ToInt32(await insertCmd.ExecuteScalarAsync());

                var userResponse = new UserResponse
                {
                    Id = userId,
                    Username = request.Username,
                    Email = request.Email,
                    Token = token,
                    ProfilePicture = null,
                    IsAdmin = false
                };

                _logger.LogInformation($"✅ User registered successfully: {request.Email}");

                return Ok(new ApiResponse 
                { 
                    Success = true, 
                    Message = "Registration successful", 
                    Data = userResponse 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Registration error: {ex.Message}");
                return StatusCode(500, new ApiResponse 
                { 
                    Success = false, 
                    Message = "Server error during registration" 
                });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation($"Login attempt for: {request.Email}");

                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "Email and password are required" 
                    });
                }

                using var connection = _dbService.GetConnection();
                await connection.OpenAsync();

                var passwordHash = DatabaseService.HashPassword(request.Password);

                var query = "SELECT id, username, email, token, profile_picture, is_admin FROM users WHERE email = @Email AND password_hash = @PasswordHash";
                using var cmd = new SqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@Email", request.Email);
                cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);

                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    _logger.LogWarning($"❌ Invalid credentials for: {request.Email}");
                    return Unauthorized(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "Invalid email or password" 
                    });
                }

                // Update token
                var newToken = DatabaseService.GenerateToken();
                var userResponse = new UserResponse
                {
                    Id = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    Email = reader.GetString(2),
                    Token = newToken,
                    ProfilePicture = reader.IsDBNull(4) ? null : reader.GetString(4),
                    IsAdmin = reader.GetBoolean(5)
                };

                reader.Close();

                // Update token in database
                var updateQuery = "UPDATE users SET token = @Token WHERE email = @Email";
                using var updateCmd = new SqlCommand(updateQuery, connection);
                updateCmd.Parameters.AddWithValue("@Token", newToken);
                updateCmd.Parameters.AddWithValue("@Email", request.Email);
                await updateCmd.ExecuteNonQueryAsync();

                _logger.LogInformation($"✅ Login successful for: {request.Email}");

                return Ok(new ApiResponse 
                { 
                    Success = true, 
                    Message = "Login successful", 
                    Data = userResponse 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Login error: {ex.Message}");
                return StatusCode(500, new ApiResponse 
                { 
                    Success = false, 
                    Message = "Server error during login" 
                });
            }
        }

        [HttpGet("profile/{token}")]
        public async Task<ActionResult<ApiResponse>> GetProfile(string token)
        {
            try
            {
                using var connection = _dbService.GetConnection();
                await connection.OpenAsync();

                var query = "SELECT id, username, email, token, profile_picture, is_admin FROM users WHERE token = @Token";
                using var cmd = new SqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@Token", token);

                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    return Unauthorized(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "Invalid or expired token" 
                    });
                }

                var userResponse = new UserResponse
                {
                    Id = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    Email = reader.GetString(2),
                    Token = reader.GetString(3),
                    ProfilePicture = reader.IsDBNull(4) ? null : reader.GetString(4),
                    IsAdmin = reader.GetBoolean(5)
                };

                return Ok(new ApiResponse 
                { 
                    Success = true, 
                    Message = "Profile retrieved", 
                    Data = userResponse 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Profile error: {ex.Message}");
                return StatusCode(500, new ApiResponse 
                { 
                    Success = false, 
                    Message = "Server error" 
                });
            }
        }

        [HttpPut("profile/{token}")]
        public async Task<ActionResult<ApiResponse>> UpdateProfile(string token, [FromBody] UpdateProfileRequest request)
        {
            try
            {
                using var connection = _dbService.GetConnection();
                await connection.OpenAsync();

                // First verify the token exists
                var verifyQuery = "SELECT id FROM users WHERE token = @Token";
                using var verifyCmd = new SqlCommand(verifyQuery, connection);
                verifyCmd.Parameters.AddWithValue("@Token", token);
                var userId = await verifyCmd.ExecuteScalarAsync();

                if (userId == null)
                {
                    return Unauthorized(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "Invalid or expired token" 
                    });
                }

                // Build dynamic update query based on provided fields
                var updateFields = new List<string>();
                var updateCmd = new SqlCommand();
                updateCmd.Connection = connection;

                if (!string.IsNullOrWhiteSpace(request.Username))
                {
                    updateFields.Add("username = @Username");
                    updateCmd.Parameters.AddWithValue("@Username", request.Username);
                }

                if (request.ProfilePicture != null)
                {
                    updateFields.Add("profile_picture = @ProfilePicture");
                    updateCmd.Parameters.AddWithValue("@ProfilePicture", request.ProfilePicture);
                }

                if (updateFields.Count == 0)
                {
                    return BadRequest(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "No fields to update" 
                    });
                }

                updateCmd.CommandText = $"UPDATE users SET {string.Join(", ", updateFields)} WHERE token = @Token";
                updateCmd.Parameters.AddWithValue("@Token", token);

                await updateCmd.ExecuteNonQueryAsync();

                // Return updated user profile
                var getQuery = "SELECT id, username, email, token, profile_picture, is_admin FROM users WHERE token = @Token";
                using var getCmd = new SqlCommand(getQuery, connection);
                getCmd.Parameters.AddWithValue("@Token", token);

                using var reader = await getCmd.ExecuteReaderAsync();
                await reader.ReadAsync();

                var userResponse = new UserResponse
                {
                    Id = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    Email = reader.GetString(2),
                    Token = reader.GetString(3),
                    ProfilePicture = reader.IsDBNull(4) ? null : reader.GetString(4),
                    IsAdmin = reader.GetBoolean(5)
                };

                _logger.LogInformation($"✅ Profile updated successfully for token: {token}");

                return Ok(new ApiResponse 
                { 
                    Success = true, 
                    Message = "Profile updated successfully", 
                    Data = userResponse 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Update profile error: {ex.Message}");
                return StatusCode(500, new ApiResponse 
                { 
                    Success = false, 
                    Message = "Server error during profile update" 
                });
            }
        }

        [HttpGet("check-admin/{token}")]
        public async Task<ActionResult<ApiResponse>> CheckAdmin(string token)
        {
            try
            {
                using var connection = _dbService.GetConnection();
                await connection.OpenAsync();

                var query = "SELECT is_admin FROM users WHERE token = @Token";
                using var cmd = new SqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@Token", token);

                var result = await cmd.ExecuteScalarAsync();

                if (result == null)
                {
                    return Unauthorized(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "Invalid or expired token" 
                    });
                }

                var isAdmin = Convert.ToBoolean(result);

                if (!isAdmin)
                {
                    return Unauthorized(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "Access denied. Admin privileges required." 
                    });
                }

                return Ok(new ApiResponse 
                { 
                    Success = true, 
                    Message = "Admin access granted",
                    Data = new { isAdmin = true }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Admin check error: {ex.Message}");
                return StatusCode(500, new ApiResponse 
                { 
                    Success = false, 
                    Message = "Server error" 
                });
            }
        }
    }
}
