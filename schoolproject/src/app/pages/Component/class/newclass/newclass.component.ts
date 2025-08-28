import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { NewclassService } from '../service/newclass.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SpinnerService } from '../../../../spinner/spinner.service';
import { AuthService } from '../../../../Service/auth.service';

 
@Component({
  selector: 'app-newclass',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule ],
  templateUrl: './newclass.component.html',
  styleUrl: './newclass.component.css'
})
// export class NewclassComponent {
//   spinnerService  = inject(SpinnerService)
//   NewclassService = inject(NewclassService)
//   authService = inject(AuthService)
  
//   toastr = inject(ToastrService);
//   newclassform!: FormGroup;
//   requestedData: any;
//   classData: any; // To hold the selected class data
 
//   userid: string | null = null;  



//   constructor(private location: Location,
//     private fb: FormBuilder,
//     private router: Router,
//     private route: ActivatedRoute,
//   ) { this.createForm(); }

//   ngOnInit(): void {
//     this.createForm();
//     if (typeof window !== 'undefined' && window.history.state && window.history.state.classData) {
//       this.classData = window.history.state.classData;
//       this.newclassform.patchValue({
//         ClassID: this.classData.ClassID,
//         classname: this.classData.Classname,
//         monthlytuitionfees: this.classData.monthlytuitionfees,
//         classteacher: this.classData.classteacher,
//       });
//     }
//   }
  
  
//   private createForm(): void {
//     debugger
//     this.newclassform = this.fb.group({
//       classname: ['', Validators.required],
//       monthlytuitionfees: ['',Validators.required],
//       classteacher:['',Validators.required],
//       SCHOOL_ID:[this.userid]
//     });
//   }


  
//   // onSubmit(): void {

//   //   if (this.newclassform.valid) {
//   //     // Directly bind the form values to the requestedData object
//   //     this.requestedData = { ...this.newclassform.value };  // Make a shallow copy of the form values
  
//   //     this.NewclassService.insertnewclass(this.requestedData).subscribe({
//   //       next: (response) => {
//   //         console.log('Class inserted successfully:', response);
//   //         this.toastr.success('Class inserted successfully!'); 
        
  
//   //         // Reset form after successful submission
//   //         this.newclassform.reset();
//   //       },
//   //       error: (error) => {
//   //         console.error('Error occurred:', error);
//   //         this.toastr.error('An error occurred while inserting the class.');
//   //       }
//   //     });
//   //   } else {
//   //     this.toastr.warning('Please fill all required fields.');
//   //   }
//   // }
//   onSubmit(): void {
    
    
//     if (this.newclassform.valid) {
       
//       // Directly bind the form values to the requestedData object
//       this.requestedData = { ...this.newclassform.value };
  
//       // Check if classData exists (indicating edit operation)
//       if (this.classData) {
//         // Include ClassID if updating an existing class
//         this.requestedData.ClassID = this.classData.ClassID; // Make sure classData has ClassID set
  
//         // Call update API (editing an existing class)
//         this.NewclassService.updateClass(this.requestedData).subscribe({
//           next: (response) => {
//             console.log('Class updated successfully:', response);
//             this.toastr.success('Class updated successfully!');
             
//             this.router.navigate(['/Allclass']); // Navigate to class listing page after update
//           },
//           error: (error) => {
//             console.error('Error occurred:', error);
//             this.toastr.error('An error occurred while updating the class.');
//           }
//         });
//       } 
//       else {
//         // If no classData exists, call insert API (creating a new class)
         
//         this.NewclassService.insertnewclass(this.requestedData).subscribe({
//           next: (response) => {
             
//             this.toastr.success( this.requestedData.classname + ' inserted successfully!');
            
//             this.router.navigate(['/Allclass']); // Navigate to class listing page after insert
//           },
//           error: (error) => {
//             if (error === 'Class with the same name already exists.') {
//               this.toastr.warning(error); // Show warning if class already exists
//             } else {
//               console.error('Error occurred:', error);
//               this.toastr.error('An error occurred while inserting the class.');
//             }
//           }
//         });
//       } 
      
//     }
//     else {
      
      
//       this.toastr.warning('Please fill all required fields.');
//     }
//   }
// }

export class NewclassComponent {
  spinnerService = inject(SpinnerService);
  NewclassService = inject(NewclassService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  
  newclassform!: FormGroup;
  requestedData: any;
  classData: any;
  userid: string | null = null;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.getUsername().subscribe(username => {
      this.userid = username;
      this.createForm(); // Form created after userid is available
      this.patchFormIfEditing(); // Populate form if editing
    });
  }

  private createForm(): void {
    this.newclassform = this.fb.group({
      classname: ['', Validators.required],
      monthlytuitionfees: ['', Validators.required],
      classteacher: ['', Validators.required],
      SCHOOL_ID: [this.userid] // Set after it's fetched from the token
    });
  }

  private patchFormIfEditing(): void {
    if (
      typeof window !== 'undefined' &&
      window.history.state &&
      window.history.state.classData
    ) {
      this.classData = window.history.state.classData;
      this.newclassform.patchValue({
        ClassID: this.classData.ClassID,
        classname: this.classData.Classname,
        monthlytuitionfees: this.classData.monthlytuitionfees,
        classteacher: this.classData.classteacher
      });
    }
  }

  onSubmit(): void {
    if (this.newclassform.valid) {
      debugger
      this.requestedData = { ...this.newclassform.value };

      if (this.classData) {
        debugger
        this.requestedData.ClassID = this.classData.ClassID;

        this.NewclassService.updateClass(this.requestedData).subscribe({
          next: (response) => {
            this.toastr.success('Class updated successfully!');
            this.router.navigate(['/Allclass']);
          },
          error: (error) => {
            console.error('Update Error:', error);
            this.toastr.error('An error occurred while updating the class.');
          }
        });
      } else {
        this.NewclassService.insertnewclass(this.requestedData).subscribe({
          next: (response) => {
            this.toastr.success(`${this.requestedData.classname} inserted successfully!`);
            this.router.navigate(['/Allclass']);
          },
          error: (error) => {
            if (error === 'Class with the same name already exists.') {
              this.toastr.warning(error);
            } else {
              console.error('Insert Error:', error);
              this.toastr.error('An error occurred while inserting the class.');
            }
          }
        });
      }
    } else {
      this.toastr.warning('Please fill all required fields.');
    }
  }
}


