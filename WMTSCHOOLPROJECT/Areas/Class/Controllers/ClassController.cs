using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using WMTSCHOOLPROJECT.Areas.Class.Models;

namespace WMTSCHOOLPROJECT.Areas.Class.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly string _connectionString;

        public ClassController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // POST: api/Class
        [HttpPost("newclass")]
        public async Task<IActionResult> PostClass([FromBody] ClassModel classData)
        {
            if (classData == null)
            {
                return BadRequest("Invalid data.");
            }

            // Validate required fields
            if (string.IsNullOrEmpty(classData.Classname) || string.IsNullOrEmpty(classData.Monthlytuitionfees) ||
                string.IsNullOrEmpty(classData.Classteacher) || string.IsNullOrEmpty(classData.SCHOOL_ID))
            {
                return BadRequest("All fields are required.");
            }

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // First, check if the class already exists
                    using (SqlCommand checkCommand = new SqlCommand("SELECT COUNT(*) FROM CLASS_MASTER WHERE CLASSNAME = @classname", connection))
                    {
                        checkCommand.Parameters.AddWithValue("@classname", classData.Classname);
                        int count = (int)await checkCommand.ExecuteScalarAsync();

                        if (count > 0)
                        {
                            // If class exists, return 409 Conflict response
                            return Conflict("Class already exists.");
                        }
                    }

                    // Create SQL command to call stored procedure
                    using (SqlCommand command = new SqlCommand("Proc_Insertclass", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Add parameters for the stored procedure
                        command.Parameters.AddWithValue("@classname", classData.Classname);
                        command.Parameters.AddWithValue("@monthlyTuitionFees", classData.Monthlytuitionfees);
                        command.Parameters.AddWithValue("@classTeacher", classData.Classteacher);
                        command.Parameters.AddWithValue("@SCHOOL_ID", classData.SCHOOL_ID);

                        // Execute the command
                        int result = await command.ExecuteNonQueryAsync();

                        if (result > 0)
                        {
                            // Return a success response with the inserted data
                            var response = new
                            {
                                message = "Class inserted successfully.",
                                data = classData
                            };

                            return Ok(response); // HTTP 200 OK
                        }
                        else
                        {
                            return BadRequest("Error inserting class.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle any errors and return a 500 status code
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    


     [HttpGet("GetClassdetails")]
        public async Task<IActionResult> GetClassdetails([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("UserId is required.");
            }

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    // Open the connection asynchronously
                    await connection.OpenAsync();

                    // Execute the stored procedure using Dapper (returns a list of ClassModel)
                    var classDetails = await connection.QueryAsync<ClassModel>(
                        "Proc_getclassdetails",
                        new { userId = userId, action = "Getclassdetails" }, // Pass userId to the stored procedure
                        commandType: CommandType.StoredProcedure
                    );

                    if (classDetails != null && classDetails.AsList().Count > 0)
                    {
                        return Ok(classDetails); // Return the result as a JSON response
                    }
                    else
                    {
                        return NotFound("No class details found for the provided userId.");
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error (use a logging framework like log4net or NLog)
                Console.WriteLine(ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}"); // Return 500 error if something goes wrong
            }
        }



        // DELETE: api/Class/DeleteClass/{ClassID}
        [HttpDelete("DeleteClass/{ClassID}")]
        public async Task<IActionResult> DeleteClass(string ClassID)
        {
            if (string.IsNullOrEmpty(ClassID))
            {
                return BadRequest("ClassID is required.");
            }

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    // Open the connection asynchronously
                    await connection.OpenAsync();

                    // Execute the stored procedure to delete the class
                    using (var command = new SqlCommand("Proc_DeleteClass", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ClassID", ClassID);

                        int rowsAffected = await command.ExecuteNonQueryAsync();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Class deleted successfully." });
                        }
                        else
                        {
                            return NotFound(new { message = "Class not found." }); // Class not found in the database
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                // Check for specific error number or message (custom error)
                if (ex.Number == 50000) // Custom error from stored procedure
                {
                    return NotFound(new { message = "Class not found." }); // Return NotFound if class doesn't exist
                }
                // General error
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Class/updateClass
        [HttpPut("updateClass")]
        public async Task<IActionResult> UpdateClass([FromBody] ClassModel updatedClass)
        {
            if (updatedClass == null)
            {
                return BadRequest("Invalid class data.");
            }

            if (updatedClass.ClassID <= 0)
            {
                return BadRequest("Class ID is missing.");
            }

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    // Open the connection asynchronously
                    await connection.OpenAsync();

                    // Define the stored procedure to update the class
                    using (var command = new SqlCommand("Proc_updateclass", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Add parameters for the fields that are provided
                        if (!string.IsNullOrEmpty(updatedClass.Classname))
                            command.Parameters.AddWithValue("@Classname", updatedClass.Classname);
                        if (!string.IsNullOrEmpty(updatedClass.Monthlytuitionfees))
                            command.Parameters.AddWithValue("@Monthlytuitionfees", updatedClass.Monthlytuitionfees);
                        if (!string.IsNullOrEmpty(updatedClass.Classteacher))
                            command.Parameters.AddWithValue("@Classteacher", updatedClass.Classteacher);

                        // Add ClassID to the parameters
                        command.Parameters.AddWithValue("@ClassID", updatedClass.ClassID);

                        // Execute the stored procedure
                        int rowsAffected = await command.ExecuteNonQueryAsync();

                       


                        if (rowsAffected > 0)
                        {
                            // Return a success response with the inserted data
                            var response = new
                            {
                                message = "Class updated successfully.",
                                
                            };

                            return Ok(response); // HTTP 200 OK
                        }




                        else
                        {
                            return NotFound("Class not found or no changes were made.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Return internal server error if something goes wrong
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

}
