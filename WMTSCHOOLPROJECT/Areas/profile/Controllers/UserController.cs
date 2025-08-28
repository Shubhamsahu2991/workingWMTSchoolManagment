using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using WMTSCHOOLPROJECT.Areas.profile.Models;

namespace WMTSCHOOLPROJECT.Areas.profile.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string _connectionString;

        // Constructor for dependency injection
        public UserController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }



        // GET: api/Profilesetting/getusers/{USER_ID}
        [HttpGet("getusers/{USER_ID}")]
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

                    // Define the stored procedure to get user details
                    using (var command = new SqlCommand("GetUserDetails", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@USER_ID", USER_ID);

                        // Execute the stored procedure and read the result
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                // Map the result to the User model
                                var user = new User
                                {
                                    USER_ID = reader["SCHOOL_ID"].ToString(),
                                    SCHOOL_NAME = reader["SCHOOL_NAME"].ToString(),
                                    SCHOOL_CODE = reader["SCHOOL_CODE"].ToString(),
                                    TargetLine = reader["TargetLine"].ToString(),
                                    SchoolRegistrationNo = reader["SchoolRegistrationNo"].ToString(),
                                    EMAILID = reader["EMAILID"].ToString(),
                                    Username = reader["Username"].ToString(),
                                    Address = reader["Address"].ToString(),
                                    MobileNo = reader["MobileNo"].ToString(),
                                    City = reader["City"].ToString(),
                                    State = reader["State"].ToString(),
                                    Country = reader["Country"].ToString(),
                                    ISACTIVE = reader["ISACTIVE"].ToString(),
                                    LogoPath = "https://localhost:44303" + reader["LogoPath"].ToString()
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
            catch (SqlException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}"); // Return 500 if there's a SQL error
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}"); // General exception handling
            }
        }



        //    // PUT: api/profilesetting/updateusers/{USER_ID}
        //    [HttpPut("updateusers/{USER_ID}")]
        //    public async Task<IActionResult> UpdateUserDetails(string USER_ID, [FromForm] IFormCollection form)
        //    {
        //        var logoFilePath = string.Empty;
        //        string relativeLogoPath = string.Empty;

        //        // Check if a logo file is provided (only process if the file is provided)
        //        if (form.Files.Count > 0)
        //        {
        //            var logoFile = form.Files["Logo"];
        //            if (logoFile != null)
        //            {
        //                // Generate a new file name based on USER_ID
        //                string logoFileName = $"{USER_ID}{Path.GetExtension(logoFile.FileName).ToLower()}";
        //                string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UploadedImages");

        //                // Ensure the directory exists
        //                if (!Directory.Exists(directoryPath))
        //                {
        //                    Directory.CreateDirectory(directoryPath);
        //                }

        //                logoFilePath = Path.Combine(directoryPath, logoFileName);

        //                // Get all files with the base name (any extension) and delete them
        //                var existingFiles = Directory.GetFiles(directoryPath, $"{USER_ID}.*");
        //                foreach (var existingFile in existingFiles)
        //                {
        //                    System.IO.File.Delete(existingFile);
        //                }

        //                // Save the new logo file
        //                using (var stream = new FileStream(logoFilePath, FileMode.Create))
        //                {
        //                    await logoFile.CopyToAsync(stream);
        //                }

        //                // Store the relative path (e.g., /UploadedImages/USER_ID.jpg) in the database
        //                relativeLogoPath = $"/UploadedImages/{logoFileName}";
        //            }
        //        }

        //        // Now, get the updated user data from the form (whether the logo is updated or not)
        //        var updatedUser = new User
        //        {
        //            SCHOOL_NAME = form["SCHOOL_NAME"],
        //            SCHOOL_CODE = form["SCHOOL_CODE"],
        //            TargetLine = form["TargetLine"],
        //            SchoolRegistrationNo = form["SchoolRegistrationNo"],
        //            Address = form["Address"],
        //            MobileNo = form["MobileNo"],
        //            City = form["City"],
        //            State = form["State"],
        //            Country = form["Country"]
        //        };

        //        // If the logo was updated, set the new logo path; otherwise, retain the old path
        //        if (!string.IsNullOrEmpty(relativeLogoPath))
        //        {
        //            updatedUser.LogoPath = relativeLogoPath;
        //        }

        //        if (updatedUser == null)
        //        {
        //            return BadRequest("User data is required.");
        //        }

        //        using (var connection = new SqlConnection(_connectionString))
        //        {
        //            using (var command = new SqlCommand("Proc_UpdateSchoolDetails", connection))
        //            {
        //                command.CommandType = CommandType.StoredProcedure;

        //                // Add the parameters for user details
        //                command.Parameters.AddWithValue("@USER_ID", USER_ID);
        //                command.Parameters.AddWithValue("@SCHOOL_NAME", updatedUser.SCHOOL_NAME);
        //                command.Parameters.AddWithValue("@SCHOOL_CODE", updatedUser.SCHOOL_CODE);
        //                command.Parameters.AddWithValue("@TargetLine", updatedUser.TargetLine);
        //                command.Parameters.AddWithValue("@SchoolRegistrationNo", updatedUser.SchoolRegistrationNo);
        //                command.Parameters.AddWithValue("@Address", updatedUser.Address);
        //                command.Parameters.AddWithValue("@MobileNo", updatedUser.MobileNo);
        //                command.Parameters.AddWithValue("@City", updatedUser.City);
        //                command.Parameters.AddWithValue("@State", updatedUser.State);
        //                command.Parameters.AddWithValue("@Country", updatedUser.Country);

        //                // Add the logo path (store the relative path or use binary data if storing as binary)
        //                if (!string.IsNullOrEmpty(updatedUser.LogoPath))
        //                {
        //                    command.Parameters.AddWithValue("@LogoPath", updatedUser.LogoPath);
        //                }
        //                else
        //                {
        //                    // If the logo was not updated, pass the existing path (you may need to retrieve it from DB)
        //                    command.Parameters.AddWithValue("@LogoPath", string.Empty);  // Optionally, handle the case of no logo update
        //                }

        //                try
        //                {
        //                    await connection.OpenAsync();
        //                    int rowsAffected = await command.ExecuteNonQueryAsync();

        //                    if (rowsAffected > 0)
        //                    {
        //                        return Ok("User details updated successfully.");
        //                    }
        //                    else
        //                    {
        //                        return NotFound();
        //                    }
        //                }
        //                catch (SqlException ex)
        //                {
        //                    return StatusCode(500, $"Internal server error: {ex.Message}");
        //                }
        //            }
        //        }
        //    }
        //} 
    }
}
 
 
