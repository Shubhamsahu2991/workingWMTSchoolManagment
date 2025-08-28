using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WMTSCHOOLPROJECT.Services;
using Dapper;

namespace WMTSCHOOLPROJECT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IDbConnection _dbConnection;
        private readonly IConfiguration _configuration;
        private readonly IOtpService _otpService;
        // private readonly IUserService _userService;  


        public AccountController(IDbConnection dbConnection, IConfiguration configuration, IOtpService otpService)
        {
            _dbConnection = dbConnection;
            _configuration = configuration;
            _otpService = otpService;
           
        }
 

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _dbConnection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Username = @Username", new { Username = loginRequest.Username });

            if (user == null || !VerifyPassword(loginRequest.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            // Validate the role from the request
            var roles = await _dbConnection.QueryAsync<string>(
                "SELECT r.Name FROM Roles r JOIN UserRoles ur ON r.Id = ur.RoleId WHERE ur.UserId = @UserId", new { UserId = user.Id });

            if (!roles.Contains(loginRequest.Role))
                return Unauthorized("Invalid credentials or role");

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Id.ToString()),
        /*new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),*/ // Add UserId here
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new
            {
              
                token = new JwtSecurityTokenHandler().WriteToken(token),
                role = loginRequest.Role // Include the role in the response
            });
        }







        [HttpPost("sendOtp")]
        public IActionResult SendOtp([FromBody] SendOtpRequest request)
        {
            // Generate OTP for the mobile number
            var otp = _otpService.GenerateOtp(request.MobileNumber);

            // Simulate sending OTP to the mobile number (replace with actual SMS service)
            bool isSent = _otpService.SendOtpToMobile(request.MobileNumber, otp);

            if (isSent)
            {
                return Ok(new { Message = "OTP sent successfully." });
            }
            return BadRequest(new { Message = "Failed to send OTP!" });
        }

        // Endpoint to verify OTP
        [HttpPost("verifyOtp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            // Verify OTP for the specific mobile number
            bool isVerified = _otpService.VerifyOtp(request.MobileNumber, request.Otp);

            if (isVerified)
            {
                return Ok(new { Message = "OTP verified successfully." });
            }
            else
            {
                // Check if OTP is expired
                if (!_otpService.IsOtpValid(request.MobileNumber))
                {
                    return BadRequest(new { Message = "OTP has expired!" });
                }

                return BadRequest(new { Message = "Invalid OTP. Please try again." });
            }
        }

        public class SendOtpRequest
        {
            public string MobileNumber { get; set; }  // Mobile number to send OTP
        }

        public class VerifyOtpRequest
        {
            public string MobileNumber { get; set; }  // Mobile number associated with OTP
            public string Otp { get; set; }  // OTP to verify
        }








        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest createUserRequest)
        {
            // Check if the username already exists
            var existingUser = await _dbConnection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Username = @Username",
                new { Username = createUserRequest.Username });

            if (existingUser != null)
                return BadRequest(new { message = "Username already exists" });

            // Hash the password using bcrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(createUserRequest.Password);

            // Insert the new user into the database, including the mobile number
            var insertUserQuery = @"
        INSERT INTO Users (Username, PasswordHash, MobileNumber) 
        VALUES (@Username, @PasswordHash, @MobileNumber);
        SELECT CAST(SCOPE_IDENTITY() AS INT)";

            var userId = await _dbConnection.QuerySingleAsync<int>(
                insertUserQuery,
                new
                {
                    Username = createUserRequest.Username,
                    PasswordHash = hashedPassword,
                    MobileNumber = createUserRequest.MobileNumber
                });

            // Insert user roles if provided
            if (createUserRequest.Roles != null && createUserRequest.Roles.Any())
            {
                foreach (var role in createUserRequest.Roles)
                {
                    // Get the roleId from the Roles table
                    var roleId = await _dbConnection.QuerySingleOrDefaultAsync<int>(
                        "SELECT Id FROM Roles WHERE Name = @RoleName",
                        new { RoleName = role });

                    if (roleId != 0)
                    {
                        // Assign the role to the new user
                        await _dbConnection.ExecuteAsync(
                            "INSERT INTO UserRoles (UserId, RoleId) VALUES (@UserId, @RoleId)",
                            new { UserId = userId, RoleId = roleId });
                    }
                }
            }

            // Insert into SchoolMaster table
            var insertSchoolMasterQuery = @"
        INSERT INTO SCHOOL_MASTER (SCHOOL_ID, USERNAME)
        VALUES (@UserId, @Username)";

            await _dbConnection.ExecuteAsync(insertSchoolMasterQuery, new
            {
                UserId = userId,
                Username = createUserRequest.Username
            });

            return Ok(new { Message = "User created successfully", UserId = userId });
        }


        //[HttpPost("create")]
        //public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest createUserRequest)
        //{
        //    // Check if the username already exists
        //    var existingUser = await _dbConnection.QueryFirstOrDefaultAsync<User>(
        //        "SELECT * FROM Users WHERE Username = @Username", new { Username = createUserRequest.Username });

        //    if (existingUser != null)
        //        return BadRequest(new { message = "Username already exists" });

        //    // Hash the password using bcrypt
        //    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(createUserRequest.Password);

        //    // Insert the new user into the database, including the mobile number
        //    var insertUserQuery = @"
        //INSERT INTO Users (Username, PasswordHash, MobileNumber) 
        //VALUES (@Username, @PasswordHash, @MobileNumber);
        //SELECT CAST(SCOPE_IDENTITY() AS INT)";
        //    var userId = await _dbConnection.QuerySingleAsync<int>(
        //        insertUserQuery,
        //        new
        //        {
        //            Username = createUserRequest.Username,
        //            PasswordHash = hashedPassword,
        //            MobileNumber = createUserRequest.MobileNumber // Pass the mobile number here
        //        });

        //    // Insert user roles if provided
        //    if (createUserRequest.Roles != null && createUserRequest.Roles.Any())
        //    {
        //        foreach (var role in createUserRequest.Roles)
        //        {
        //            // Get the roleId from the roles table
        //            var roleId = await _dbConnection.QuerySingleOrDefaultAsync<int>(
        //                "SELECT Id FROM Roles WHERE Name = @RoleName", new { RoleName = role });

        //            if (roleId != 0)
        //            {
        //                // Assign the role to the new user
        //                await _dbConnection.ExecuteAsync(
        //                    "INSERT INTO UserRoles (UserId, RoleId) VALUES (@UserId, @RoleId)",
        //                    new { UserId = userId, RoleId = roleId });
        //            }
        //        }
        //    }

        //    return Ok(new { Message = "User created successfully", UserId = userId });
        //}


        // Password verification (bcrypt)
        private bool VerifyPassword(string inputPassword, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
        }
    }

    // DTO for LoginRequest
    public class LoginRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }

        public required string Role { get; set; }
    }

    // DTO for CreateUserRequest
    public class CreateUserRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public List<string> Roles { get; set; }  // Roles can be passed as a list (e.g., ["Admin", "Manager"])
        public required string MobileNumber { get; set; }
    }

    // Simple User model
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
    }


    public class SendOtpRequest
    {
        public required string MobileNumber { get; set; }
    }

    public class VerifyOtpRequest
    {
        public required string MobileNumber { get; set; }
        public required string Otp { get; set; }
    }
}
