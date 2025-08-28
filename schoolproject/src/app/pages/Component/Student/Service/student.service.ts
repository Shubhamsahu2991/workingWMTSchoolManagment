import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Student } from '../modal/Student.modal';
import { AuthService } from '../../../../Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  USERID: string | null = null; // Initialize USERID to null
  private studentsUrl= 'https://localhost:7250/api/StudentApi/insertstudent';
  private apiUrl= 'https://localhost:7250/api/StudentApi';
  private deletestudentURL = 'https://localhost:7250/api/StudentApi/DeleteStudent';
  private getAllStudenturl = 'https://localhost:7250/api/StudentApi/getAllStudents';
 
  constructor(private http: HttpClient , private authService : AuthService) {
  this.authService.getUsername().subscribe(username => { this.USERID = username;  });
  
   } 

  addStudent(requestedData: any ): Observable<any> {
    return this.http.post(this.studentsUrl, requestedData );
  }

 

  getAllStudents(): Observable<any[]> {
  return this.http.get<any[]>(`${this.getAllStudenturl}?userId=${this.USERID}`).pipe(
    catchError(this.handleError)
  );
 }

   getStudentById(studentId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student/?studentId=${studentId}`);
  }
 


  updateStudent(student: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updatestudent/${student.id}`, student);
  }


  deleteClass(id: string): Observable<any> {
    return this.http.delete(`${this.deletestudentURL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  
  private handleError(error: HttpErrorResponse) {
     
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }
  
}
