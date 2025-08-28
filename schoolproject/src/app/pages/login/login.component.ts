import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
 import { first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
   error = '';
   isLoading = false;
 
 
   constructor(
     private formBuilder: FormBuilder,
     private authService: AuthService,
     private router: Router
   ) {}
 
   ngOnInit(): void {
     this.loginForm = this.formBuilder.group({
       username: ['', Validators.required],
       password: ['', Validators.required],
       role: ['',Validators.required] 
     });
   }
   selectRole(role: string) {
   this.loginForm.controls['role'].setValue(role);
   this.loginForm.controls['role'].markAsTouched();
 }
 
   // Getter for easy access to form fields
   get f() {
     return this.loginForm.controls;
   }
 
   onSubmit(): void {
    
     if (this.loginForm.invalid) {
       return;
     }
     this.isLoading = true; 
      
     const { username, password, role } = this.f;
 
     this.authService.login(username.value, password.value, role.value).pipe(first()).subscribe({
       next: (response) => {
         this.authService.setSession(response, response.token);
         //this.authService.setUsername(username.value);
          
 
         // Navigate to the dashboard based on the role
         if (response.role === 'School') {
           this.router.navigate(['/Dashboard']);
         } else if (response.role === 'Student') {
           this.router.navigate(['/UserDashboard']);
         } else if (response.role === 'Teacher') {
           this.router.navigate(['/ManagerDashboard']);
         } else {
           this.error = 'Role not recognized';
         }
 
         this.isLoading = false; 
       },
         error: (error) => {
           this.error = 'Invalid username or password';
           this.isLoading = false;
         }
       });
   }

 
}

