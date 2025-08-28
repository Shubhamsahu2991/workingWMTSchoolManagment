import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../Service/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inject AuthService to check authentication and roles
  const router = inject(Router);

  const token = authService.getToken();  // Retrieve the token from AuthService

  // Check if the token exists
  if (token) {
    const requiredRole = route.data['role'];  // Get the required role from route data
    const userRole$ = authService.getRole();  // Get current user role as an Observable

    return new Observable<boolean>((observer) => {
      // Subscribe to the userRole observable to check if the user has the required role
      userRole$.subscribe((userRole) => {
        // If the required role exists, and the user role doesn't match, deny access
        if (requiredRole && userRole !== requiredRole) {
          router.navigate(['/login']);  // Redirect to login if the roles don't match
          observer.next(false);
        } else {
          // If token exists and the role matches, allow route activation
          observer.next(true);
        }
      });
    });
  } else {
    // If no token exists, deny route activation and redirect to login
    router.navigate(['/login']);
    return of(false);  // Return an observable of false to block navigation
  }
};
