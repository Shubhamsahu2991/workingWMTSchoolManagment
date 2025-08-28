import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Subject } from '../Modal/subjectclas';
import { AuthService } from '../../../../Service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class SubjectService {
 USERID: string  | null = null;
  private addsubjectURL = 'https://localhost:7250/api/Subject/newsubject'; // Base URL to your API
  private GetSubjectdetailsURL = 'https://localhost:7250/api/Subject/GetSubjectdetails'; // Base URL to your API

  
  
  constructor(private http:HttpClient ,private authService: AuthService) {
      this.authService.getUsername().subscribe(username => { this.USERID = username;  });
   }

  addSubjects(subjectData: { subjects: Subject[] }): Observable<any> {
    return this.http.post<any>(this.addsubjectURL, subjectData ).pipe(
      catchError(this.handleError)
    );
  }


  GetSubjectdetails(): Observable<any[]> {
    const schoolId = this.USERID  // Get the school ID from the service
    const body = { schoolId };  // Send the schoolId in the body

    return this.http.post<any[]>(this.GetSubjectdetailsURL, body);  // Use POST request
  }

  
  
  private handleError(error: HttpErrorResponse) {
     
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }

}
