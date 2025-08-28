import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Schoolmodal } from '../modal/school.modal';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private getapiUrl = 'https://localhost:44303/api/getusers';
  private updateapiUrl = 'https://localhost:44303/api/updateusers';


  constructor(private http: HttpClient) { }

 // Method to get user details (GET request)
getUserDetails(USER_ID: string): Observable<Schoolmodal> {
  return this.http.get<Schoolmodal>(`${this.getapiUrl}/${USER_ID}`);   
}
 

updateUserDetails(USER_ID: string, userDetails: any): Observable<any> {
  return this.http.put(`${this.updateapiUrl}/${USER_ID}`, userDetails);  
}
}
