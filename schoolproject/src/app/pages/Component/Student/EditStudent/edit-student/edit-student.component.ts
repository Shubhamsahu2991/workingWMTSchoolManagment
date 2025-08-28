import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../Service/student.service';
import { Student } from '../../modal/Student.modal';
import { CommonModule } from '@angular/common';
import { NewclassService } from '../../../class/service/newclass.service';
import { Getclassdetails } from '../../../class/model/class';
import { AuthService } from '../../../../../Service/auth.service';
import Swal from 'sweetalert2';

 

@Component({
    standalone: true,
    imports: [CommonModule,ReactiveFormsModule],
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  studentForm!: FormGroup;
  studentId: string = '';
  classes: Getclassdetails[] = [];
  authService = inject(AuthService)

  USERID: string | null = null; // To hold the USER_ID

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private studentService: StudentService,
    private newClassService: NewclassService
  ) {
         this.authService.getUsername().subscribe(username => { this.USERID = username;  });
    // Initialize the form
    this.createForm();

  }

  ngOnInit(): void {

    this.loadClassData();
    // Get the student ID from the route
    this.route.paramMap.subscribe(params => {
      this.studentId = params.get('id')!;
      this.getStudentDetails(this.studentId);
    });
     
  }

  // Create the form with validators
  private createForm(): void {
    this.studentForm = this.fb.group({
      id: [''],
      Name: ['', Validators.required],
      Rno: ['', Validators.required],
      classname: ['', Validators.required],
      PicturePIC: ['', Validators.required],
      DateofAdmission: ['', Validators.required],
      DiscountInFee: ['', Validators.required],
      MobileNo: ['', Validators.required],
      DateOfBirth: ['', Validators.required],
      AdhaarID: ['', Validators.required],
      Domicile: ['', Validators.required],
      Gender: ['', Validators.required],
      Cast: ['', Validators.required],
      city: ['', Validators.required],
      FatherName: ['', Validators.required],
      FatherNationalID: ['', Validators.required],
      FOccupation: ['', Validators.required],
      FatherEducation: ['', Validators.required],
      FatherMobileNo: ['', Validators.required],
      FatherProfession: ['', Validators.required],
      FIncome: ['', Validators.required],
      MotherName: ['', Validators.required],
      MotherNationalID: ['', Validators.required],
      MOccupation: ['', Validators.required],
      MotherEducation: ['', Validators.required],
      MotherMobileNo: ['', Validators.required],
      MotherProfession: ['', Validators.required],
      MIncome: ['', Validators.required],
      Status: [''],
      Username: [''],
      Password: ['Student@123'],
      CLASSID: [''],
      SchoolId: [this.USERID]
    
    });
  }

  // Get student details using the service
  private getStudentDetails(id: string): void {
     debugger
    this.studentService.getStudentById(id).subscribe(
      (student: any) => {
        // Populate the form with the fetched student data
        this.studentForm.patchValue({
          id: student.id,
          Name: student.Name,
          Rno: student.Rno,
          classname: student.CLASSID,
          PicturePIC: student.PicturePIC,
          DateofAdmission: student.DateofAdmission,
          DiscountInFee: student.DiscountInFee,
          MobileNo: student.MobileNo,
          DateOfBirth: student.DateOfBirth,
          AdhaarID: student.AdhaarID,
          Domicile: student.Domicile,
          Gender: student.Gender,
          Cast: student.Cast,
          city: student.City,
          FatherName: student.FatherName,
          FatherNationalID: student.FatherNationalID,
          FOccupation: student.FOccupation,
          FatherEducation: student.FatherEducation,
          FatherMobileNo: student.FatherMobileNo,
          FatherProfession: student.FatherProfession,
          FIncome: student.FIncome,
          MotherName: student.MotherName,
          MotherNationalID: student.MotherNationalID,
          MOccupation: student.MOccupation,
          MotherEducation: student.MotherEducation,
          MotherMobileNo: student.MotherMobileNo,
          MotherProfession: student.MotherProfession,
          MIncome: student.MIncome

        });
      },
      error => {
        console.error('Error fetching student details', error);
      }
    );
  }


  loadClassData(): void {
    if (this.USERID) {
      this.newClassService.Getclassdetails(this.USERID).subscribe({
        next: (response) => {
          this.classes = response; // Store the API response into classes
          console.log('Classes loaded successfully', this.classes); // Debugging to see the output
        },
        error: (error) => {
          console.error('Error occurred while loading class data:', error);
        }
      });
    } else {
      console.error('USER_ID is null or undefined. Cannot load class data.');
    }
  }

  // Update the student details
  // updateStudent(): void {
  //   if (this.studentForm.valid) {
  //     const updatedStudent: Student = this.studentForm.value;
  //     updatedStudent.id = this.studentId; // Make sure the Rno is passed

  //     this.studentService.updateStudent(updatedStudent).subscribe(
  //        response => {

  //         console.log('Student updated successfully');
  //         this.router.navigate(['/Allstudent']); // Navigate back to the student list
  //       },
  //       error => {
  //         console.error('Error updating student', error);
  //       }
  //     );
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }

updateStudent(): void {
  if (this.studentForm.valid) {
    const updatedStudent: any = this.studentForm.value;
    updatedStudent.id = this.studentId;

    this.studentService.updateStudent(updatedStudent).subscribe(
      response => {
        // Show SweetAlert with static success message
        Swal.fire({
          title: 'Success!',
          text: response ? response.message : 'Student updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/Allstudent']); // Navigate after confirmation
        });
      },
      error => {
        const errorMessage = error?.error?.message || 'Failed to update student.';
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  } else {
    Swal.fire({
      title: 'Invalid Form',
      text: 'Please fill all required fields.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }
}

}
