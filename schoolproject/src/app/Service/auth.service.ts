import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {jwtDecode} from 'jwt-decode';

export interface LoginResponse {
  token: string;
  role: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7250/api/Account';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  public usernameSubject = new BehaviorSubject<string | null>(null);
  public roleSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize username and role on service creation
    const username = this.getUsernameFromToken();
    const role = this.getRoleFromToken();

    this.usernameSubject.next(username);
    this.roleSubject.next(role);

    if (isPlatformBrowser(this.platformId)) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      this.currentUserSubject = new BehaviorSubject<any>(currentUser);
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string, role: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { Username: username, Password: password, Role: role });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('role');
      localStorage.removeItem('userid');
    }
    this.usernameSubject.next(null);
    this.roleSubject.next(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  setSession(user: any, token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('access_token', token);
      localStorage.setItem('role', user.role);
    }
    this.currentUserSubject.next(user);
    this.roleSubject.next(user.role);

    // Update username BehaviorSubject immediately
    const username = this.getUsernameFromToken();
    this.usernameSubject.next(username);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  getUsername(): Observable<string | null> {
    return this.usernameSubject.asObservable();
  }


   getUSER_ID(): Observable<string | null> {
    return this.usernameSubject.asObservable();
  }

  getRole(): Observable<string | null> {
    return this.roleSubject.asObservable();
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      if (isPlatformBrowser(this.platformId) && username) {
        localStorage.setItem('userid', username);
      }
      return username || null;
    }
    return null;
  }

  private getRoleFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    }
    return null;
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('role');
      localStorage.removeItem('userid');
    }
    this.usernameSubject.next(null);
    this.roleSubject.next(null);
    this.currentUserSubject.next(null);
  }
}
