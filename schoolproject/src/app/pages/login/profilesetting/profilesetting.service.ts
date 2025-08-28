import { Injectable } from '@angular/core';
import { Schoolmodal } from '../modal/school.modal';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilesettingService {
  private getapiUrl = 'https://localhost:7250/api/profilesetting/getprofilesetting';
  private updateapiUrl = 'https://localhost:7250/api/profilesetting/updateprofilesetting';
  private deleteapiUrl = 'https://localhost:7250/api/profilesetting/deleteusers';
  
  constructor(private http: HttpClient) { }


  getUserDetailsprofilesetting(USER_ID: string): Observable<Schoolmodal> {
    return this.http.get<Schoolmodal>(`${this.getapiUrl}/${USER_ID}`);   
  }

  updateUserDetailsprofilesetting(USER_ID: string, userDetails: any): Observable<any> {
    debugger;
    return this.http.put(`${this.updateapiUrl}/${USER_ID}`, userDetails);  
  }


   // Method to call the backend API for deleting user account
   deleteUserAccount(USER_ID: string): Observable<any> {
    const url = `${this.deleteapiUrl}/${USER_ID}`;
    return this.http.delete(url);
    
  }
   
}
