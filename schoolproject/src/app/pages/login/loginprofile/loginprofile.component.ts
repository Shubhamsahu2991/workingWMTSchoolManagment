import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from './profile.service';
import { Schoolmodal } from '../modal/school.modal';
import { SpinnerService } from '../../../spinner/spinner.service';
import {  ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../Service/auth.service';

@Component({
  selector: 'app-loginprofile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './loginprofile.component.html',
  styleUrl: './loginprofile.component.css'
})
export class LoginprofileComponent {
  spinnerservice = inject(SpinnerService)
  authService = inject(AuthService)
  profileservice = inject(ProfileService)
  profileForm!: FormGroup;
  USER_ID: string | null = null;
  profileData: Schoolmodal | undefined 
  selectedFile: File | null = null;
  Filename:string = ' ' 

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    
    this.authService.getUsername().subscribe(username => { this.USER_ID = username; });// You can fetch this from the user service or route params

    // Initialize form
    this.profileForm = this.fb.group({
      SCHOOL_NAME: ['', Validators.required],
      SCHOOL_CODE: ['', Validators.required],
      TargetLine: ['', Validators.required],
      SchoolRegistrationNo: ['', Validators.required],
      Address: ['', Validators.required],
      MobileNo: ['', Validators.required],
      City: ['', Validators.required],
      State: ['', Validators.required],
      Country: ['', Validators.required],
      logo: [null]
    });

    // Fetch user details and populate the form
    this.loadUserProfile();
    console.log ( this.profileForm.value)
  }

  loadUserProfile(): void {
    if (!this.USER_ID) {
      console.error("USER_ID is null, cannot load user profile.");
      return;
    }
    this.profileservice.getUserDetails(this.USER_ID).subscribe((data: Schoolmodal) => {
      console.log(data);  // Log the fetched data
      
      // Assuming data is an array, we need to use the first element if available
      if (data) {
          // Use the first item from the array
          this.profileData = data;
        // Populate form with fetched data
        this.profileForm.patchValue({
          SCHOOL_NAME: data.SCHOOL_NAME,           
          SCHOOL_CODE: data.SCHOOL_CODE,          
          TargetLine: data.TargetLine,     
          SchoolRegistrationNo: data.SchoolRegistrationNo,  
          Address: data.Address,
          MobileNo: data.MobileNo,       
          City: data.City,
          State: data.State,
          Country: data.Country
        });
       
      
      } else {
        console.error("No school data found!");
      }
    });
  }
  

  onSubmit(): void {
    if (this.profileForm.valid) {
      
      const formData = new FormData();
  
      // Append form fields to FormData
      for (const key in this.profileForm.value) {
        if (this.profileForm.value[key]) {
          formData.append(key, this.profileForm.value[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('Logo', this.selectedFile, this.selectedFile.name);
      }
  
      // Ensure USER_ID is not null before sending the form data to the API
      if (!this.USER_ID) {
        Swal.fire({
          title: 'Error!',
          text: 'User ID is missing. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Okay'
        });
        return;
      }
      this.profileservice.updateUserDetails(this.USER_ID, formData).subscribe(
        (response) => {
          Swal.fire({
            title: 'Success!',
            text: 'Your profile has been updated successfully.',
            icon: 'success',
            confirmButtonText: 'Okay'
          });
          this.loadUserProfile();
          this.Filename = ' ';
 
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
        title: 'Invalid Form!',
        text: 'Please fill in all the required fields correctly.',
        icon: 'warning',
        confirmButtonText: 'Okay'
      });
    }
    
  }
  
  
  onFileSelected(event: any): void {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      this.selectedFile = file;
      this.Filename = file.name;
      console.log('File selected:', file);
    }
  }

 
}
