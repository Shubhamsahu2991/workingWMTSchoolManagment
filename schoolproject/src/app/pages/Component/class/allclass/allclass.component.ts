import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NewclassService } from '../service/newclass.service';
import { Getclassdetails } from '../model/class';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SpinnerService } from '../../../../spinner/spinner.service';

import { AuthService } from '../../../../Service/auth.service';

@Component({
  selector: 'app-allclass',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allclass.component.html',
  styleUrl: './allclass.component.css'
})
export class AllclassComponent {
  authService = inject(AuthService)
  spinnerService  = inject(SpinnerService)
  classes: Getclassdetails[] = [];
  USERID: string | null = null; // To hold the USER_ID

  constructor(private newClassService: NewclassService ,private router: Router ) { }

  ngOnInit(): void {
     this.authService.getUsername().subscribe(username => { this.USERID = username;  });
    this.loadClassData(); // Fetch the data when the component is initialized
  }

  // Method to load class data from API
  loadClassData(): void {

    if (this.USERID) {
      this.newClassService.Getclassdetails(this.USERID).subscribe({
        next: (response) => {
          this.classes = response; // Store the API response into classes
          console.log('Classes loaded successfully', this.classes); // Debugging to see the output
        // Hide the spinner after data is loaded
        },
        error: (error) => {
          console.error('Error occurred while loading class data:', error);
           // Hide the spinner even if there’s an error
        }
      });
    } else {
      console.error('USER_ID is null. Cannot load class data.');
    }
  }


   // Method to navigate to the edit class page with the selected class data
   onEdit(classItem: any): void {
    debugger;
    this.router.navigate(['/newclass'], { state: { classData: classItem  } });
  }

  onDelete(classItem: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the class "${classItem.Classname}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the delete action
        this.newClassService.deleteClass(classItem.ClassID).subscribe({
          next: (response) => {
            console.log('Class deleted successfully', response);
            // Remove the deleted class from the local classes array
            this.classes = this.classes.filter(item => item.ClassID !== classItem.ClassID);
            // Show success message
            Swal.fire('Deleted!', `Class "${classItem.Classname}" has been deleted.`, 'success');
          },
          error: (error) => {
            console.error('Error occurred while deleting class:', error);
            Swal.fire('Error!', 'An error occurred while deleting the class.', 'error');
          }
        });
      } else {
        console.log('Class deletion cancelled');
      }
    });
  }
  

  onnegivate(){
    this.router.navigate(['/newclass']);
  }


}
