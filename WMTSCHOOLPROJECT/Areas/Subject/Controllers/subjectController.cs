using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using WMTSCHOOLPROJECT.Areas.Subject.Models;

namespace WMTSCHOOLPROJECT.Areas.Subject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly string _connectionString;

        // Constructor for dependency injection
        public SubjectController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // POST: api/subject/newsubject
        [HttpPost("newsubject")]
        public async Task<IActionResult> PostSubjects([FromBody] SubjectDataModel subjectData)
        {
            if (subjectData == null || subjectData.Subjects == null || subjectData.Subjects.Count == 0)
            {
                return BadRequest("No subjects provided.");
            }

            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    foreach (var subject in subjectData.Subjects)
                    {
                        var result = await connection.ExecuteAsync(
                            "Proc_InsertSubject",
                            new
                            {
                                SubjectName = subject.Subjectname,
                                SubjectMarks = subject.Subjectmarks,
                                ClassID = subject.ClassID,
                                SCHOOL_ID = subject.SCHOOL_ID
                            },
                            commandType: CommandType.StoredProcedure
                        );

                        if (result <= 0)
                        {
                            return StatusCode(500, "Error inserting subject.");
                        }
                    }
                    var response = new
                    {
                        message = "Subjects inserted successfully.",
                    };

                    return Ok(response);
                    
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        // POST: api/subject/GetSubjectdetails
        [HttpPost("GetSubjectdetails")]
        public async Task<IActionResult> GetSubjectDetails([FromBody] SchoolRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.SchoolId))
            {
                return BadRequest("School ID is required.");
            }

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    var subjectDetails = await connection.QueryAsync<SubjectModal>(
                        "Proc_getSubjectdetails",
                        new { action = "GetSubjectdetails", schoolId = request.SchoolId },
                        commandType: CommandType.StoredProcedure
                    );

                    return Ok(subjectDetails);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    // Model classes

    public class SchoolRequest
    {
        public string SchoolId { get; set; }
    }

    public class SubjectDataModel
    {
        public List<Subject> Subjects { get; set; }
    }

    public class Subject
    {
        public string Subjectname { get; set; }
        public int Subjectmarks { get; set; }
        public int ClassID { get; set; }
        public string SCHOOL_ID { get; set; }
    }

    
}
