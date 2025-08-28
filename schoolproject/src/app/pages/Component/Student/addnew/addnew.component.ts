import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Getclassdetails } from '../../class/model/class';
import { NewclassService } from '../../class/service/newclass.service';
import { CommonModule } from '@angular/common';
import { StudentService } from '../Service/student.service';
import { Student } from '../modal/Student.modal';
import { AuthService } from '../../../../Service/auth.service';

@Component({
  selector: 'app-addnew',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './addnew.component.html',
  styleUrl: './addnew.component.css'
})
export class AddnewComponent {
  classes: Getclassdetails[] = [];
  studentForm!: FormGroup;
  USERID: string | null = null; // To hold the USER_ID
  studentservice = inject(StudentService)
  authService = inject(AuthService)
  requestedData: any;



  constructor(private fb: FormBuilder ,  private newClassService: NewclassService) {
      this.authService.getUsername().subscribe(username => { this.USERID = username;  });
      
    }

  ngOnInit(): void {
   this.createForm(); 
    
    this.loadClassData();
  }
  
 
   private createForm(): void {
     this.studentForm = this.fb.group({
      Name: ['', Validators.required],
      Rno: ['',Validators.required],
      Classname:['',Validators.required],
      PicturePIC:['', Validators.required],
      DateofAdmission: ['', Validators.required],
      DiscountInFee: ['',Validators.required],
      MobileNo:['',Validators.required],
      DateOfBirth:['', Validators.required],
      AdhaarID: ['', Validators.required],
      Domicile: ['',Validators.required],
      Gender:['',Validators.required],
      Cast:['', Validators.required],
      City: ['', Validators.required],
      FatherName: ['',Validators.required],
      FatherNationalID:['',Validators.required],
      FOccupation:['', Validators.required],
      FatherEducation : ['',Validators.required],
      FatherMobileNo:['',Validators.required],
      FatherProfession:['', Validators.required],
      FIncome:['', Validators.required],
      MotherName: ['',Validators.required],
      MotherNationalID:['',Validators.required],
      MOccupation:['', Validators.required],
      MotherEducation : ['',Validators.required],
      MotherMobileNo:['',Validators.required],
      MotherProfession:['', Validators.required],
      MIncome:['', Validators.required],
      id  : [''],
      Status  : [''],
      Username : [''],
      Password  : ['Student@123'],
      CLASSID: [''],
      SchoolId :[this.USERID]
     });
   }


  // Generate password: first 4 of Name + last 4 of MobileNo
  generatePassword(): string {
    const name: string = this.studentForm.get('Name')?.value || '';
    const mobile: string = this.studentForm.get('MobileNo')?.value || '';
    const first4 = name.substring(0, 4);
    const last4 = mobile.slice(-4);
    return first4 + last4;
  }

  // Call this method when Name or MobileNo changes
  updatePasswordField() {
    const password = this.generatePassword();
    this.studentForm.get('Password')?.setValue(password);
  }

   onSubmit() {
    if (this.studentForm.valid) {
      debugger;
      // Set the Password field to the generated password
      this.updatePasswordField();
      
      this.requestedData = {...this.studentForm.value}
      this.studentservice.addStudent(this.requestedData).subscribe(
        response => {
          debugger;
          console.log('Student added successfully', response);
          alert('Student added successfully!');
          this.studentForm.reset();
        },
        error => {
          debugger;
          console.error('Error adding student', error);
          alert('There was an error adding the student.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
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
      console.error('USER_ID is null. Cannot load class data.');
    }
  }
  
}
