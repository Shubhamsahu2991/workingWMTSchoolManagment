import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonEngine } from '@angular/ssr';
import { StudentService } from '../Service/student.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Student } from '../modal/Student.modal';

@Component({
  selector: 'app-addmissionletter',
  standalone: true,
  imports: [CommonModule,FormsModule],

  templateUrl: './addmissionletter.component.html',
  styleUrl: './addmissionletter.component.css'
})
export class AddmissionletterComponent {
  rNo: string = '';  // Bind this to the input field

  suggestions: any [] = [];  // Store the suggestions list
  selectedStudent: any | null = null;   // Store the selected student details

  constructor(private studentService: StudentService,private http: HttpClient) {}

  ngOnInit(): void {}

  onSearch(): void {
    debugger;
    if (this.rNo.length >= 2) {  // Start searching when 2 or more characters are typed
      this.searchStudents(this.rNo).subscribe((data: any[]) => {
        this.suggestions = data;
      });
    } else {
      this.suggestions = [];  // Clear suggestions if input is too short
    }
  }

  // Call the API to get search results
  searchStudents(rNo: string): Observable<any> {
    return this.http.get(`https://localhost:7250/api/StudentApi/search/${rNo}`);
  }
 
  // Handle student selection from the suggestion list
  onSelectStudent(student: any): void {
    this.selectedStudent = student;
    this.suggestions = [];  // Clear the suggestions after selection
  }

  printAdmissionLetter(): void {
    // Check if the selected student exists
    if (this.selectedStudent) {
      // Open a new window for printing
      const printWindow = window.open('', '', 'width=800,height=600');
  
      // Write the selected student's admission details to the print window
      printWindow?.document.write(`
        <html>
          <head>
            <title>Admission Letter</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              h1, h2, h3 {
                text-align: center;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                padding: 8px;
                text-align: left;
                border: 1px solid #ddd;
              }
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              .section {
                margin-bottom: 20px;
              }
              .section h3 {
                text-align: left;
                margin-bottom: 10px;
              }
              .four-column-table td {
                width: 25%;
              }
              .icon-block {
                text-align: center;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <h1>sagar public school</h1>
            <h1>Admission Confirmation</h1>
          
            
            <!-- General Information -->
            <div class="section">
              <h3>General Information</h3>
              <table class="four-column-table">
              <tr>
                  <td><strong>Student Name:</strong></td>
                  <td>${this.selectedStudent.Name}</td>
                  <td><strong>Class:</strong></td>
                  <td>${this.selectedStudent.Classname}</td>
                </tr>
                <tr>
                  <td><strong>Registration/ID:</strong></td>
                  <td>${this.selectedStudent.Rno}</td>
                  <td><strong>Class:</strong></td>
                  <td>${this.selectedStudent.Classname}</td>
                </tr>
                <tr>
                  <td><strong>Admission Date:</strong></td>
                  <td>${this.selectedStudent.DateofAdmission}</td>
                  <td><strong>Account Status:</strong></td>
                  <td>${this.selectedStudent.Status}</td>
                </tr>
                <tr>
                  <td><strong>Username:</strong></td>
                  <td>${this.selectedStudent.Username}</td>
                  <td><strong>Password:</strong></td>
                  <td>${this.selectedStudent.Password}</td>
                </tr>
              </table>
            </div>
  
            <!-- Personal Information -->
            <div class="section">
              <h3>Personal Information</h3>
              <table class="four-column-table">
                <tr>
                  <td><strong>Date of Birth:</strong></td>
                  <td>${this.selectedStudent.DateOfBirth}</td>
                  <td><strong>Adhaar ID:</strong></td>
                  <td>${this.selectedStudent.AdhaarID}</td>
                </tr>
                <tr>
                  <td><strong>Domicile:</strong></td>
                  <td>${this.selectedStudent.Domicile}</td>
                  <td><strong>Gender:</strong></td>
                  <td>${this.selectedStudent.Gender}</td>
                </tr>
                <tr>
                  <td><strong>Cast:</strong></td>
                  <td>${this.selectedStudent.Cast}</td>
                  <td><strong>City:</strong></td>
                  <td>${this.selectedStudent.City}</td>
                </tr>
              </table>
            </div>
  
            <!-- Father's Information -->
            <div class="section">
              <h3>Father's Information</h3>
              <table class="four-column-table">
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>${this.selectedStudent.FatherName}</td>
                  <td><strong>National ID:</strong></td>
                  <td>${this.selectedStudent.FatherNationalID}</td>
                </tr>
                <tr>
                  <td><strong>Occupation:</strong></td>
                  <td>${this.selectedStudent.FOccupation}</td>
                  <td><strong>Education:</strong></td>
                  <td>${this.selectedStudent.FatherEducation}</td>
                </tr>
                <tr>
                  <td><strong>Mobile No:</strong></td>
                  <td>${this.selectedStudent.FatherMobileNo}</td>
                  <td><strong>Profession:</strong></td>
                  <td>${this.selectedStudent.FatherProfession}</td>
                </tr>
                <tr>
                  <td><strong>Income:</strong></td>
                  <td>${this.selectedStudent.FIncome}</td>
                  <td><strong>Mother's National ID:</strong></td>
                  <td>${this.selectedStudent.MotherNationalID}</td>
                </tr>
              </table>
            </div>
  
            <!-- Mother's Information -->
            <div class="section">
              <h3>Mother's Information</h3>
              <table class="four-column-table">
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>${this.selectedStudent.MotherName}</td>
                  <td><strong>National ID:</strong></td>
                  <td>${this.selectedStudent.MotherNationalID}</td>
                </tr>
                <tr>
                  <td><strong>Occupation:</strong></td>
                  <td>${this.selectedStudent.MOccupation}</td>
                  <td><strong>Education:</strong></td>
                  <td>${this.selectedStudent.MotherEducation}</td>
                </tr>
                <tr>
                  <td><strong>Mobile No:</strong></td>
                  <td>${this.selectedStudent.MotherMobileNo}</td>
                  <td><strong>Profession:</strong></td>
                  <td>${this.selectedStudent.MotherProfession}</td>
                </tr>
                <tr>
                  <td><strong>Income:</strong></td>
                  <td>${this.selectedStudent.MIncome}</td>
                </tr>
              </table>
            </div>
  
            <!-- Additional Information -->
            <div class="section">
              <h3>Additional Details</h3>
              <table class="four-column-table">
                <tr>
                  <td><strong>Picture:</strong></td>
                  <td><img src="${this.selectedStudent.PicturePIC}" alt="Student Picture" style="width: 100px; height: 100px;"></td>
                  <td><strong>Discount in Fee:</strong></td>
                  <td>${this.selectedStudent.DiscountInFee}</td>
                </tr>
              </table>
            </div>
  
            <div class="icon-block">
              <button onclick="window.print()" class="btn btn-primary">Print</button>
            </div>
          </body>
        </html>
      `);
  
      // Close the document to apply the styles and print
      printWindow?.document.close();
      printWindow?.print();
    }
  }
    
  
  
}


