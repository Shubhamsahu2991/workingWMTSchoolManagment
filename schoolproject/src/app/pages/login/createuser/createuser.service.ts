import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateuserService {

  // Your API endpoint URLs (Adjust accordingly)
  private apiUrl = 'https://localhost:7250/api/Account/create'; // For user creation
  private otpUrl = 'https://localhost:7250/api/Account/sendOtp'; // Endpoint to send OTP
  private verifyOtpUrl = 'https://localhost:7250/api/Account/verifyOtp'; // Endpoint to verify OTP

  constructor(private http: HttpClient) { }

  // Create user
  createUser(createUserRequest: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, createUserRequest);
  }

  // Send OTP to mobile number
  sendOtp(mobileNumber: string): Observable<any> {
    return this.http.post<any>(this.otpUrl, { mobileNumber });
  }

  // Verify OTP entered by the user
  verifyOtp(mobileNumber: string, otp: string): Observable<any> {
    return this.http.post<any>(this.verifyOtpUrl, { mobileNumber, otp });
  }
}
