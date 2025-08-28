import { Component, inject } from '@angular/core';
import { StudentService } from '../Service/student.service';
import { Student } from '../modal/Student.modal';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../../../spinner/spinner.service';
 

@Component({
  selector: 'app-allstudent',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './allstudent.component.html',
  styleUrl: './allstudent.component.css'
})
export class AllstudentComponent {
  spinnerService = inject(SpinnerService)

  students: Student[] = [];
  selectedStudent: any = null; 
  isCardView: boolean = true; 

  filteredStudents: any [] = []; 
  searchText: string = ''; // This will bind to the search input


  sortColumn: keyof Student = 'Name';  // Define the column to be sorted, default to 'Name'
  sortDirection: boolean = true;  // true for ascending, false for descending
   
  studentItem: any;


  constructor(private studentService: StudentService, private router:Router   ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

   // Set view to List format
   opencard(): void {
    this.isCardView = true;
  }

  // Set view to List format
  openlist(): void {
    this.isCardView = false;
  }
// Fetch all students
loadStudents(): void {
 
  this.studentService.getAllStudents().subscribe(
    (data) => {
      this.students = data;
      this.filteredStudents = data;
     
    },
    (error) => {
      console.error('Error fetching students', error);
    }
  );
}

filterStudents(): void {
  console.log('Filtering students with search text:', this.searchText);  // Debugging
  if (this.searchText.trim() !== '') {
    this.filteredStudents = this.students.filter(student =>
      student.Name.toLowerCase().includes(this.searchText.toLowerCase()) // Case-insensitive search
    );
  } else {
    this.filteredStudents = this.students; // Reset the filtered list if search text is empty
  }
  console.log('Filtered students:', this.filteredStudents);  // Log filtered data to debug
 
}

  

  viewStudentDetailsid(id: string): void {
    this.router.navigate(['/edit', id]);  // Navigate to the edit page with the student's ID
  }


   onDelete(student: any): void {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to delete the student "${student.Name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with the delete action
          this.studentService.deleteClass(student.id).subscribe({
            next: (response) => {
              console.log('student deleted successfully', response);
              // Remove the deleted class from the local classes array
              this.filteredStudents = this.filteredStudents.filter(item => item.id !== student.id);
              // Show success message
              Swal.fire('Deleted!', `student "${student.Name}" has been deleted.`, 'success');
            },
            error: (error) => {
              console.error('Error occurred while deleting student:', error);
              Swal.fire('Error!', 'An error occurred while deleting the student.', 'error');
            }
          });
        } else {
          console.log('student deletion cancelled');
        }
      });
    }






  // Fetch student by ID (e.g., when clicking on a card)
  viewStudentDetails(id: string): void {

    this.studentService.getStudentById(id).subscribe(
      (data) => {
        this.selectedStudent = data; // Display the student details
        this.showStudentDetails();

      },
      (error) => {
        console.error('Error fetching student details', error);
      }
    );
  }

  showStudentDetails(): void {
    if (this.selectedStudent) {
      Swal.fire({
        title: `${this.selectedStudent.Name}`,
        html: `
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td><strong>Registration No</strong></td>
                <td>${this.selectedStudent.Rno}</td>
                <td><strong>Class</strong></td>
                <td>${this.selectedStudent.Classname}</td>
              </tr>
              <tr>
                <td><strong>Date of Admission</strong></td>
                <td>${this.selectedStudent.DateofAdmission}</td>
                <td><strong>Mobile No</strong></td>
                <td>${this.selectedStudent.MobileNo}</td>
              </tr>
              <tr>
                <td><strong>Date of Birth</strong></td>
                <td>${this.selectedStudent.DateOfBirth}</td>
                <td><strong>Gender</strong></td>
                <td>${this.selectedStudent.Gender}</td>
              </tr>
              <tr>
                <td><strong>Cast</strong></td>
                <td>${this.selectedStudent.Cast}</td>
                <td><strong>City</strong></td>
                <td>${this.selectedStudent.City}</td>
              </tr>
              <tr>
                <td><strong>Father's Name</strong></td>
                <td>${this.selectedStudent.FatherName}</td>
                <td><strong>Mother's Name</strong></td>
                <td>${this.selectedStudent.MotherName}</td>
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                <td style="color:green">${this.selectedStudent.Status}</td>
                <td colspan="2" class="text-center"><strong>Information</strong></td>
              </tr>
            </tbody>
          </table>
        `,
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Close',
        customClass: {
          popup: 'student-details-popup',
        },
        width: '80%',
        didOpen: () => {
          // Add the print button dynamically after the modal opens
          const printButton = document.createElement('button');
          printButton.innerHTML = 'Print';
          printButton.classList.add('swal2-confirm', 'swal2-styled');
          printButton.style.marginTop = '10px';
          printButton.style.backgroundColor = '#0d6efd';
          printButton.style.color = 'white';
          printButton.style.border = 'none';
          printButton.style.padding = '10px 20px';
          printButton.style.cursor = 'pointer';
  
          // Add the button to the modal footer
          const footer = document.querySelector('.swal2-actions');
          if (footer) {
            footer.appendChild(printButton);
            printButton.addEventListener('click', () => {
              this.printStudentDetails();
            });
          }
        }
      });
    }
  }
  
  printStudentDetails(): void {
    // Create a printable window
    const printWindow = window.open('', '', 'width=800,height=600');
    const printContent = `
      <html>
        <head>
          <title>Student Details</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            }
            th, td {
              padding: 8px 12px;
              border: 1px solid #ddd;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
              font-weight: bold;
            }
            td {
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
         <h1>sagar public school</h1>
          <h2>Student Details</h2>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td><strong>Registration No</strong></td>
                <td>${this.selectedStudent?.Rno}</td>
                <td><strong>Class</strong></td>
                <td>${this.selectedStudent?.Classname}</td>
              </tr>
              <tr>
                <td><strong>Date of Admission</strong></td>
                <td>${this.selectedStudent?.DateofAdmission}</td>
                <td><strong>Mobile No</strong></td>
                <td>${this.selectedStudent?.MobileNo}</td>
              </tr>
              <tr>
                <td><strong>Date of Birth</strong></td>
                <td>${this.selectedStudent?.DateOfBirth}</td>
                <td><strong>Gender</strong></td>
                <td>${this.selectedStudent?.Gender}</td>
              </tr>
              <tr>
                <td><strong>Cast</strong></td>
                <td>${this.selectedStudent?.Cast}</td>
                <td><strong>City</strong></td>
                <td>${this.selectedStudent?.City}</td>
              </tr>
              <tr>
                <td><strong>Father's Name</strong></td>
                <td>${this.selectedStudent?.FatherName}</td>
                <td><strong>Mother's Name</strong></td>
                <td>${this.selectedStudent?.MotherName}</td>
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                <td style="color:green">${this.selectedStudent?.Status}</td>
                <td colspan="2" class="text-center"><strong>Information</strong></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;
    // Write content to the window and initiate printing
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  }



  printTable(): void {
    // Get the content of the table
    const tableContent = document.querySelector('.table-responsive')?.innerHTML;
  
    // If content is found, print it
    if (tableContent) {
      // Open a new window for printing
      const printWindow = window.open('', '', 'width=800,height=600');
  
      // Inject custom styles into the print window
      printWindow?.document.write(`
        <html>
          <head>
            <title>Student Table</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
              }
              th, td {
                padding: 8px 12px;
                border: 1px solid #ddd;
                text-align: left;
              }
              th {
                background-color: #f4f4f4;
                font-weight: bold;
              }
              td {
                word-wrap: break-word;
              }
              .table-responsive {
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body>
            <h2>Student Table</h2>
            ${tableContent}
          </body>
        </html>
      `);
  
      // Close the document to ensure styles are applied and then trigger print
      printWindow?.document.close();
      printWindow?.print();
    }
  }
  
  
  
  sortTable(column: keyof Student): void {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection;  // Toggle sort direction
    } else {
      this.sortColumn = column;
      this.sortDirection = true;  // Default to ascending order
    }

    this.filteredStudents.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortDirection ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection ? 1 : -1;
      }
      return 0;
    });
  }
}
