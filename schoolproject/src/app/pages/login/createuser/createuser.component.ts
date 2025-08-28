import { CommonModule } from '@angular/common'; 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateuserService } from './createuser.service';  // Your service for creating users

@Component({
  selector: 'app-createuser',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit {
  createuserform!: FormGroup;
  otpSent = false; // Track if OTP has been sent
  otpValid = false; // Track if OTP has been verified
  error!: string;
  mobileNumber!: string;
  otp!: string; // OTP value

  constructor(
    private fb: FormBuilder,
    private userService: CreateuserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize the form with validators
    this.createuserform = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['0', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]], // OTP input
    }, { 
      validator: this.passwordMatchValidator
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password === confirmPassword) {
      return null;
    }

    return { passwordsDoNotMatch: true };
  }

  // Send OTP to the provided mobile number
  sendOtp() {
    if (this.createuserform.get('mobileNumber')?.invalid) {
      return;
    }

    this.mobileNumber = this.createuserform.get('mobileNumber')?.value;

    this.userService.sendOtp(this.mobileNumber).subscribe(
      (response) => {
        this.otpSent = true; // OTP is sent
        this.error = ''; // Clear error message
      },
      (error) => {
        this.error = error.error?.message || 'Invalid OTP. Please try again.';
       
      }
    );
  }

  // Verify OTP entered by the user
  verifyOtp() {
    if (this.createuserform.get('otp')?.invalid) {
      return;
    }

    this.otp = this.createuserform.get('otp')?.value;

    this.userService.verifyOtp(this.mobileNumber, this.otp).subscribe(
      (response) => {
        this.otpValid = true; // OTP is valid
        this.error = ''; // Clear any error message
      },
      (error) => {
        this.error = error.error?.message || 'Invalid OTP. Please try again.';
      }
    );
  }

  // Getters for easier access in template
  get username() { return this.createuserform.get('username'); }
  get password() { return this.createuserform.get('password'); }
  get confirmPassword() { return this.createuserform.get('confirmPassword'); }
  get mobileNumberControl() { return this.createuserform.get('mobileNumber'); }
  get role() { return this.createuserform.get('role'); }
  get otpControl() { return this.createuserform.get('otp'); }

  // Handle form submission and create user
  onSubmit() {
    if (this.createuserform.invalid || !this.otpValid) {
      return;
    }

    const { username, password, role, mobileNumber } = this.createuserform.value;

    this.userService.createUser({ username, password, roles: [role], mobileNumber })
      .subscribe(
        (response) => {
          this.router.navigate(['/login']); // Navigate to login page on successful user creation
        },
        (error) => {
          this.error = error.error?.message || 'An error occurred while creating the user.';
          console.log(this.error);  // Log the error message for debugging
        
        }
      );
  }
}
