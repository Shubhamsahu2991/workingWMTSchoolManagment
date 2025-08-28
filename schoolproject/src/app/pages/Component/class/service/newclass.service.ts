import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Classmodal } from '../model/class';


@Injectable({
  providedIn: 'root'
})
export class NewclassService {
  private newclassURL ='https://localhost:7250/api/Class/newclass'
  private GetclassdetailsURL ='https://localhost:7250/api/Class/GetClassdetails'
  private deleteClassURL ='https://localhost:7250/api/Class/DeleteClass'
  private editclassurl = 'https://localhost:7250/api/Class'; // Base URL to your API

  constructor(private http:HttpClient) { }

  insertnewclass(requestedData: Classmodal) {
    return this.http.post(this.newclassURL, requestedData).pipe(
    catchError(this.handleError)
  );
}

Getclassdetails(USER_ID: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.GetclassdetailsURL}?userId=${USER_ID}`).pipe(
    catchError(this.handleError)
  );
}

deleteClass(ClassID: string): Observable<any> {
  return this.http.delete(`${this.deleteClassURL}/${ClassID}`).pipe(
    catchError(this.handleError)
  );
}

updateClass(classData: any): Observable<any> {
  return this.http.put(`${this.editclassurl}/updateClass`, classData).pipe(
    catchError(this.handleError)
  );
}

private handleError(error: HttpErrorResponse) {
  if (error.status === 409) {
    // Handle conflict error (class with same name already exists)
    console.error('Class already exists.');
    return throwError('Class with the same name already exists.');
  }
  console.error('An error occurred:', error.message);
  return throwError('Something went wrong; please try again later.');
}

}
