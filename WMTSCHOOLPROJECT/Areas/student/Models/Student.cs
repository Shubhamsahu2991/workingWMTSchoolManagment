namespace WMTSCHOOLPROJECT.Areas.student.Models
{
    public class Student
    {
        public string id { get; set; }
        public string Name { get; set; }
        public string Rno { get; set; }
        public string Classname { get; set; }
        public string PicturePIC { get; set; }
        public DateTime DateofAdmission { get; set; }
        public decimal DiscountInFee { get; set; }
        public string MobileNo { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string AdhaarID { get; set; }
        public string Domicile { get; set; }
        public string Gender { get; set; }
        public string Cast { get; set; }
        public string City { get; set; }
        public string FatherName { get; set; }
        public string FatherNationalID { get; set; }
        public string FOccupation { get; set; }
        public string FatherEducation { get; set; }
        public string FatherMobileNo { get; set; }
        public string FatherProfession { get; set; }
        public decimal FIncome { get; set; }
        public string MotherName { get; set; }
        public string MotherNationalID { get; set; }
        public string MOccupation { get; set; }
        public string MotherEducation { get; set; }
        public string MotherMobileNo { get; set; }
        public string MotherProfession { get; set; }
        public decimal MIncome { get; set; }
        public string Status { get; set; }

        public string CLASSID { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public string SchoolId { get; set; }
    }
}
