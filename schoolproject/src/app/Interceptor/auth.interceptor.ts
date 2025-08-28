import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { SpinnerService } from '../spinner/spinner.service';
import { AuthService } from '../Service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(SpinnerService); 
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  loaderService.show();
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          authService.removeToken();  
          router.navigate(['/login']);  
          authService.logout();
        }
        return throwError(() => error);
      }),
      finalize(() => {
        loaderService.hide();
      })
    );
  }

  return next(req).pipe(
    finalize(() => {
      loaderService.hide();
    })
  ); // Proceed with the request if there's no token
};
