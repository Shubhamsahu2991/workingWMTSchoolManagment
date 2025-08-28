using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using WMTSCHOOLPROJECT.Areas.student.Models;
using Dapper;
using WMTSCHOOLPROJECT.Controllers;
using WMTSCHOOLPROJECT.Areas.Class.Models;


namespace WMTSCHOOLPROJECT.Areas.student.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentApiController : ControllerBase
    {
        private readonly string _connectionString;

        public StudentApiController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet("getAllStudents")]
        public async Task<IActionResult> getAllStudents([FromQuery] string userId)
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
                    var students = await connection.QueryAsync<Student>(
                        "GetAllStudents",
                        new { userId = userId  }, // Pass userId to the stored procedure
                        commandType: CommandType.StoredProcedure
                    );

                    if (students != null && students.AsList().Count > 0)
                    {
                        return Ok(students); // Return the result as a JSON response
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


        [HttpGet("student")]
        public async Task<IActionResult> GetClassDetails([FromQuery] string studentId)
        {
            if (string.IsNullOrEmpty(studentId))
            {
                return BadRequest("studentId is required.");
            }

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Return a single student object
                    var student = await connection.QueryFirstOrDefaultAsync<Student>(
                        "GetStudentById",
                        new { studentId },
                        commandType: CommandType.StoredProcedure
                    );

                    if (student != null)
                    {
                        return Ok(student);
                    }
                    else
                    {
                        return NotFound("Student not found for the provided ID.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpPost("insertstudent")]
        public async Task<ActionResult> AddStudent([FromBody] Student student)
             
        {
            if (student == null)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(student.Password);

                    using (var cmd = new SqlCommand("InsertStudent", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Add all parameters
                        cmd.Parameters.AddWithValue("@Name", student.Name);
                        cmd.Parameters.AddWithValue("@Rno", student.Rno);
                        cmd.Parameters.AddWithValue("@Classname", student.Classname);
                        cmd.Parameters.AddWithValue("@PicturePIC", student.PicturePIC);
                        cmd.Parameters.AddWithValue("@DateofAdmission", student.DateofAdmission);
                        cmd.Parameters.AddWithValue("@DiscountInFee", student.DiscountInFee);
                        cmd.Parameters.AddWithValue("@MobileNo", student.MobileNo);
                        cmd.Parameters.AddWithValue("@DateOfBirth", student.DateOfBirth);
                        cmd.Parameters.AddWithValue("@AdhaarID", student.AdhaarID);
                        cmd.Parameters.AddWithValue("@Domicile", student.Domicile);
                        cmd.Parameters.AddWithValue("@Gender", student.Gender);
                        cmd.Parameters.AddWithValue("@Cast", student.Cast);
                        cmd.Parameters.AddWithValue("@City", student.City);
                        cmd.Parameters.AddWithValue("@FatherName", student.FatherName);
                        cmd.Parameters.AddWithValue("@FatherNationalID", student.FatherNationalID);
                        cmd.Parameters.AddWithValue("@FOccupation", student.FOccupation);
                        cmd.Parameters.AddWithValue("@FatherEducation", student.FatherEducation);
                        cmd.Parameters.AddWithValue("@FatherMobileNo", student.FatherMobileNo);
                        cmd.Parameters.AddWithValue("@FatherProfession", student.FatherProfession);
                        cmd.Parameters.AddWithValue("@FIncome", student.FIncome);
                        cmd.Parameters.AddWithValue("@MotherName", student.MotherName);
                        cmd.Parameters.AddWithValue("@MotherNationalID", student.MotherNationalID);
                        cmd.Parameters.AddWithValue("@MOccupation", student.MOccupation);
                        cmd.Parameters.AddWithValue("@MotherEducation", student.MotherEducation);
                        cmd.Parameters.AddWithValue("@MotherMobileNo", student.MotherMobileNo);
                        cmd.Parameters.AddWithValue("@MotherProfession", student.MotherProfession);
                        cmd.Parameters.AddWithValue("@MIncome", student.MIncome);
                        cmd.Parameters.AddWithValue("@password", hashedPassword);
                        cmd.Parameters.AddWithValue("@SchoolId", student.SchoolId);

                        // Execute the reader to get returned values
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                var result = new
                                {
                                    StudentId = reader["StudentId"],
                                    Username = reader["Username"],
                                    Role = reader["Role"]
                                };

                                return Ok(result);
                            }
                            else
                            {
                                return BadRequest("Student insertion failed.");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





        // PUT api/updatestudent/{id}
        [HttpPut("updatestudent/{id}")]
         public async Task<ActionResult> UpdateStudent(string id, [FromBody] Student student)
         {
             if (student == null || string.IsNullOrEmpty(id))
             {
                 return BadRequest("Invalid data.");
             }
     
             try
             {
                 using (var conn = new SqlConnection(_connectionString))
                 {
                     // Open the connection asynchronously
                     await conn.OpenAsync();
     
                     // Define the command to call the stored procedure
                     var cmd = new SqlCommand("UpdateStudent", conn)
                     {
                         CommandType = CommandType.StoredProcedure
                     };
     
                     // Add parameters to the command
                     cmd.Parameters.AddWithValue("@StudentID", id);  // ID of the student to update
                     cmd.Parameters.AddWithValue("@Name", student.Name);
                     cmd.Parameters.AddWithValue("@Rno", student.Rno);
                     cmd.Parameters.AddWithValue("@Classname", student.Classname);
                     cmd.Parameters.AddWithValue("@PicturePIC", student.PicturePIC);
                     cmd.Parameters.AddWithValue("@DateofAdmission", student.DateofAdmission);
                     cmd.Parameters.AddWithValue("@DiscountInFee", student.DiscountInFee);
                     cmd.Parameters.AddWithValue("@MobileNo", student.MobileNo);
                     cmd.Parameters.AddWithValue("@DateOfBirth", student.DateOfBirth);
                     cmd.Parameters.AddWithValue("@AdhaarID", student.AdhaarID);
                     cmd.Parameters.AddWithValue("@Domicile", student.Domicile);
                     cmd.Parameters.AddWithValue("@Gender", student.Gender);
                     cmd.Parameters.AddWithValue("@Cast", student.Cast);
                     cmd.Parameters.AddWithValue("@City", student.City);
                     cmd.Parameters.AddWithValue("@FatherName", student.FatherName);
                     cmd.Parameters.AddWithValue("@FatherNationalID", student.FatherNationalID);
                     cmd.Parameters.AddWithValue("@FOccupation", student.FOccupation);
                     cmd.Parameters.AddWithValue("@FatherEducation", student.FatherEducation);
                     cmd.Parameters.AddWithValue("@FatherMobileNo", student.FatherMobileNo);
                     cmd.Parameters.AddWithValue("@FatherProfession", student.FatherProfession);
                     cmd.Parameters.AddWithValue("@FIncome", student.FIncome);
                     cmd.Parameters.AddWithValue("@MotherName", student.MotherName);
                     cmd.Parameters.AddWithValue("@MotherNationalID", student.MotherNationalID);
                     cmd.Parameters.AddWithValue("@MOccupation", student.MOccupation);
                     cmd.Parameters.AddWithValue("@MotherEducation", student.MotherEducation);
                     cmd.Parameters.AddWithValue("@MotherMobileNo", student.MotherMobileNo);
                     cmd.Parameters.AddWithValue("@MotherProfession", student.MotherProfession);
                     cmd.Parameters.AddWithValue("@MIncome", student.MIncome);
     
                     var result = await cmd.ExecuteNonQueryAsync();
     
                     if (result > 0)
                     {
                        return Ok(new
                        {
                            message = "Student updated successfully.",
                           
                        });
                        //return Ok("Student updated successfully.");
                     }
                     else
                     {
                         return BadRequest("Error updating student.");
                     }
                 }
             }
             catch (Exception ex)
             {
                 // Log the exception if necessary and return a 500 response
                 return StatusCode(500, $"Internal server error: {ex.Message}");
             }
         }




         

        // DELETE: api/StudentApi/DeleteStudent/{id}
        [HttpDelete("DeleteStudent/{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Student ID is required.");
            }
     
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Proc_DeleteStudent", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", id);
     
                        await con.OpenAsync();
     
                        int result = await cmd.ExecuteNonQueryAsync();
     
                        if (result > 0)
                        {
                            return Ok(new { message = "Student deleted successfully." });
                        }
                        else
                        {
                            return NotFound(new { message = "Student not found." });
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                if (ex.Number == 50000) // Custom error from stored procedure
                {
                    return NotFound(new { message = "Student not found." });
                }
     
                return StatusCode(500, new { message = "Internal server error.", details = ex.Message });
            }
        }





        // GET: api/StudentApi/students/search/{rNo}
        //[HttpGet("search/{rNo}")]
        //public async Task<ActionResult<IEnumerable<Student>>> SearchStudents(string rNo)
        //{
        //    if (string.IsNullOrEmpty(rNo))
        //    {
        //        return BadRequest("RNo is required.");
        //    }

        //    try
        //    {
        //        var students = new List<Student>();

        //        using (var conn = new SqlConnection(_connectionString))
        //        {
        //            await conn.OpenAsync();

        //            // Define the query
        //            string query = "SELECT * FROM Students s " +

        //                           "WHERE s.RNo LIKE @RNo";

        //            using (var cmd = new SqlCommand(query, conn))
        //            {
        //                cmd.Parameters.AddWithValue("@RNo", rNo + "%");

        //                using (var reader = await cmd.ExecuteReaderAsync())
        //                {
        //                    while (await reader.ReadAsync())
        //                    {
        //                        students.Add(new Student
        //                        {
        //                            id = reader["id"].ToString(),
        //                            Rno = reader["Rno"].ToString(),
        //                            Name = reader["Name"].ToString(),
        //                            Classname = reader["Classname"].ToString(),
        //                            PicturePIC = reader["PicturePIC"].ToString(),
        //                            DateofAdmission = Convert.ToDateTime(reader["DateofAdmission"]),
        //                            DiscountInFee = Convert.ToDecimal(reader["DiscountInFee"]),
        //                            MobileNo = reader["MobileNo"].ToString(),
        //                            DateOfBirth = Convert.ToDateTime(reader["DateOfBirth"]),
        //                            AdhaarID = reader["AdhaarID"].ToString(),
        //                            Domicile = reader["Domicile"].ToString(),
        //                            Gender = reader["Gender"].ToString(),
        //                            Cast = reader["Cast"].ToString(),
        //                            City = reader["City"].ToString(),
        //                            FatherName = reader["FatherName"].ToString(),
        //                            FatherNationalID = reader["FatherNationalID"].ToString(),
        //                            FOccupation = reader["FOccupation"].ToString(),
        //                            FatherEducation = reader["FatherEducation"].ToString(),
        //                            FatherMobileNo = reader["FatherMobileNo"].ToString(),
        //                            FatherProfession = reader["FatherProfession"].ToString(),
        //                            FIncome = Convert.ToDecimal(reader["FIncome"]),
        //                            MotherName = reader["MotherName"].ToString(),
        //                            MotherNationalID = reader["MotherNationalID"].ToString(),
        //                            MOccupation = reader["MOccupation"].ToString(),
        //                            MotherEducation = reader["MotherEducation"].ToString(),
        //                            MotherMobileNo = reader["MotherMobileNo"].ToString(),
        //                            MotherProfession = reader["MotherProfession"].ToString(),
        //                            MIncome = Convert.ToDecimal(reader["MIncome"]),
        //                            Status = reader["Status"].ToString(),
        //                            Username = reader["Username"].ToString(),
        //                            Password = reader["Password"].ToString()
        //                        });
        //                    }
        //                }
        //            }
        //        }

        //        if (students.Count == 0)
        //        {
        //            return NotFound();  // Return 404 if no students found
        //        }

        //        return Ok(students);  // Return 200 OK with the list of students
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = "There was an error processing your request.", details = ex.Message });
        //    }
        //}

        [HttpGet("search/{rNo}")]
        public async Task<ActionResult<IEnumerable<Student>>> SearchStudents(string rNo)
        {
            if (string.IsNullOrEmpty(rNo))
            {
                return BadRequest("RNo is required.");
            }

            try
            {
                var students = new List<Student>();

                using (var conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (var cmd = new SqlCommand("SearchStudentsByRNo", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@RNo", rNo);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                students.Add(new Student
                                {
                                    id = reader["id"].ToString(),
                                    Rno = reader["Rno"].ToString(),
                                    Name = reader["Name"].ToString(),
                                    Classname = reader["Classname"].ToString(),
                                    PicturePIC = reader["PicturePIC"].ToString(),
                                    DateofAdmission = Convert.ToDateTime(reader["DateofAdmission"]),
                                    DiscountInFee = Convert.ToDecimal(reader["DiscountInFee"]),
                                    MobileNo = reader["MobileNo"].ToString(),
                                    DateOfBirth = Convert.ToDateTime(reader["DateOfBirth"]),
                                    AdhaarID = reader["AdhaarID"].ToString(),
                                    Domicile = reader["Domicile"].ToString(),
                                    Gender = reader["Gender"].ToString(),
                                    Cast = reader["Cast"].ToString(),
                                    City = reader["City"].ToString(),
                                    FatherName = reader["FatherName"].ToString(),
                                    FatherNationalID = reader["FatherNationalID"].ToString(),
                                    FOccupation = reader["FOccupation"].ToString(),
                                    FatherEducation = reader["FatherEducation"].ToString(),
                                    FatherMobileNo = reader["FatherMobileNo"].ToString(),
                                    FatherProfession = reader["FatherProfession"].ToString(),
                                    FIncome = Convert.ToDecimal(reader["FIncome"]),
                                    MotherName = reader["MotherName"].ToString(),
                                    MotherNationalID = reader["MotherNationalID"].ToString(),
                                    MOccupation = reader["MOccupation"].ToString(),
                                    MotherEducation = reader["MotherEducation"].ToString(),
                                    MotherMobileNo = reader["MotherMobileNo"].ToString(),
                                    MotherProfession = reader["MotherProfession"].ToString(),
                                    MIncome = Convert.ToDecimal(reader["MIncome"]),
                                    Status = reader["Status"].ToString(),
                                    Username = reader["Username"].ToString(),
                                    Password = reader["PasswordHash"].ToString()
                                });
                            }
                        }
                    }
                }

                if (students.Count == 0)
                {
                    return NotFound();
                }

                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "There was an error processing your request.", details = ex.Message });
            }
        }

         



        public class SchoolRequest
        {
            public string? SchoolId { get; set; }
        }
    }
}
