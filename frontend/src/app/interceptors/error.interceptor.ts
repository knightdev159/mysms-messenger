import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { ApiError } from '../models/message.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.clearSession();
        router.navigate(['/login']);
        toast.error('Please log in again.');
      } else if (error.status === 0) {
        toast.error('Unable to connect to server. Please check your connection.');
      } else if (error.status === 429) {
        toast.warning('Too many requests. Please wait a moment and try again.');
      } else if (error.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.status === 422) {
        const apiError = error.error as ApiError;
        const message = apiError?.error?.message || 'Validation failed';
        toast.error(message);
      }

      return throwError(() => error);
    })
  );
};
