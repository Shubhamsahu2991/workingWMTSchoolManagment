import { Component, inject } from '@angular/core';
import { Schoolmodal } from '../modal/school.modal';
import { ProfilesettingService } from './profilesetting.service';
import { SpinnerService } from '../../../spinner/spinner.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../Service/auth.service';

@Component({
  selector: 'app-profilesetting',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './profilesetting.component.html',
  styleUrl: './profilesetting.component.css'
})
export class ProfilesettingComponent {
spinnerservice = inject(SpinnerService)
profilesetting = inject(ProfilesettingService)
authService = inject(AuthService)
  // Define the form group
 profilesettingForm!: FormGroup;
  USERID: string | null = null; // To hold the USER_ID
 
  profileData: Schoolmodal | undefined 
  isPasswordVisible: boolean = false;

constructor(private fb: FormBuilder , private router: Router) {
    this.authService.getUsername().subscribe(username => { this.USERID = username;  });

}
  
    ngOnInit(): void {

  
      // Initialize form
      this.profilesettingForm = this.fb.group({
        Username: ['', Validators.required],
        Password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      });
  
      // Fetch user details and populate the form
      this.loadUserProfile();
      console.log ( this.profilesettingForm.value)
    }
  
    loadUserProfile(): void {
      if (!this.USERID) {
        console.error("USERID is null, cannot load user profile.");
        return;
      }
      this.profilesetting.getUserDetailsprofilesetting(this.USERID).subscribe((data: Schoolmodal) => {
        console.log(data);  // Log the fetched data
        if (data) {
         this.profileData = data;
          // Populate form with fetched data
          this.profilesettingForm.patchValue({
            Username: data.Username,           
            Password: data.Password,          
          });
         
       
        } else {
          console.error("No school data found!");
        }
      });
    }
    
    onSubmit(): void {
      debugger
      if (this.profilesettingForm.valid) {
        debugger
    
        // Get the form data without confirmPassword
        const { confirmPassword, ...formData } = this.profilesettingForm.value; // Destructure to remove confirmPassword
        
        // Send the form data to the API
        if (this.USERID) {
          this.profilesetting.updateUserDetailsprofilesetting(this.USERID, formData).subscribe(
            (response) => {
              Swal.fire({
                title: 'Success!',
                text: 'Your profile has been updated successfully.',
                icon: 'success',
                confirmButtonText: 'Okay'
              });
              this.loadUserProfile();
            },
            (error) => {
              Swal.fire({
                title: 'Error!',
                text: 'There was an error updating your profile. Please try again.',
                icon: 'error',
                confirmButtonText: 'Okay'
              });
            }
          );
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'User ID is not available. Please log in again.',
            icon: 'error',
            confirmButtonText: 'Okay'
          });
        }
      } else {
        Swal.fire({
          title: 'Invalid Form!',
          text: 'Please fill in all the required fields correctly.',
          icon: 'warning',
          confirmButtonText: 'Okay'
        });
      }
    }

     // Method to delete the account
  deleteAccount() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
       
        if (this.USERID) {
          this.profilesetting.deleteUserAccount(this.USERID).subscribe(
            (response) => {
              Swal.fire({
                title: 'Deleted!',
                text: 'Your account has been deleted.',
                icon: 'success',
                confirmButtonText: 'Okay'
              });
              
              // Optionally, navigate to a different page or log the user out after deletion
              this.authService.logout();
              this.router.navigate(['/login']);
            },
            (error) => {
              Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting your account. Please try again.',
                icon: 'error',
                confirmButtonText: 'Okay'
              });
            }
          );
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'User ID is not available. Please log in again.',
            icon: 'error',
            confirmButtonText: 'Okay'
          });
        }
      }
    });
  }
    

    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
}
