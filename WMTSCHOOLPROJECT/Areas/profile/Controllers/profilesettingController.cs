using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using WMTSCHOOLPROJECT.Areas.profile.Models;
using WMTSCHOOLPROJECT.Controllers;



namespace WMTSCHOOLPROJECT.Areas.profile.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class profilesettingController : ControllerBase
    {
        private readonly string _connectionString;

        // Constructor for dependency injection
        public profilesettingController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // GET: api/Profilesetting/getprofilesetting/{USER_ID}
        [HttpGet("getprofilesetting/{USER_ID}")]
        public async Task<IActionResult> GetUserDetails(string USER_ID)
        {
            if (string.IsNullOrEmpty(USER_ID))
            {
                return BadRequest("USER_ID is required.");
            }

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    // Open the connection asynchronously
                    await connection.OpenAsync();

                    // Set up command to execute the stored procedure
                    using (var command = new SqlCommand("Proc_GetprofilesettingDetails", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@USER_ID", USER_ID);

                        // Execute the stored procedure and read the result
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                // Map the result to the User model
                                var user = new Models.User
                                {
                                    USER_ID = reader["ID"].ToString(),
                                    Username = reader["USERNAME"].ToString(),
                                    Password = reader["PASSWORD"].ToString(),
                                    ISACTIVE = reader["ISACTIVE"].ToString(),
                                };

                                return Ok(user); // Return the user data as a JSON object
                            }
                            else
                            {
                                return NotFound(); // Return 404 if no user is found
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Return internal server error if there's an exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




        // PUT: api/Profilesetting/updateprofilesetting/{USER_ID}
        [HttpPut("updateprofilesetting/{USER_ID}")]
        public async Task<IActionResult> UpdateProfileSetting(string USER_ID, [FromBody] Models.User updatedUser)
        {
            if (updatedUser == null || string.IsNullOrEmpty(updatedUser.Username) || string.IsNullOrEmpty(updatedUser.Password))
            {
                return BadRequest("Invalid data. Username and Password are required.");
            }
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(updatedUser.Password);


            try
            {

                using (var connection = new SqlConnection(_connectionString))
                {
                    // Open the connection asynchronously
                    await connection.OpenAsync();

                    // Define the stored procedure to update user details
                    using (var command = new SqlCommand("Proc_updateusersetting", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Add the parameters for user details
                        command.Parameters.AddWithValue("@USER_ID", USER_ID);
                        command.Parameters.AddWithValue("@Username", updatedUser.Username);
                        command.Parameters.AddWithValue("@Password", hashedPassword); // Assuming plain password is to be updated

                        // Execute the stored procedure and get the number of rows affected
                        int rowsAffected = await command.ExecuteNonQueryAsync();

                        if (rowsAffected > 0)
                        {
                            return Ok("User details updated successfully.");
                        }
                        else
                        {
                            return NotFound(); // Return 404 if no rows were affected (user not found)
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                // Return internal server error if there’s a database-related error
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Catch any other general exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        } 




            // DELETE: api/Profilesetting/deleteusers/{USER_ID}
            [HttpDelete("deleteusers/{USER_ID}")]
            public async Task<IActionResult> DeleteUserAccount(string USER_ID)
            {
                if (string.IsNullOrEmpty(USER_ID))
                {
                    return BadRequest("USER_ID is required.");
                }

                try
                {
                    using (var connection = new SqlConnection(_connectionString))
                    {
                        // Open the connection asynchronously
                        await connection.OpenAsync();

                        // Define the stored procedure for deleting the user account
                        using (var command = new SqlCommand("Proc_deleteuser", connection))
                        {
                            command.CommandType = CommandType.StoredProcedure;

                            // Add the parameters for the user ID
                            command.Parameters.AddWithValue("@USER_ID", USER_ID);

                            // Execute the stored procedure and get the number of rows affected
                            int rowsAffected = await command.ExecuteNonQueryAsync();

                            if (rowsAffected > 0)
                            {
                                return Ok("User account deleted successfully.");
                            }
                            else
                            {
                                return NotFound(); // Return 404 if no rows were affected (user not found)
                            }
                        }
                    }
                }
                catch (SqlException ex)
                {
                    // Return internal server error if there's a database-related error
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
                catch (Exception ex)
                {
                    // Catch any other general exceptions
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }
    }
 
