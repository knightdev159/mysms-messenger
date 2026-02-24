import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/message.model';
import { AuthUser, LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'mysms_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  private readonly token = signal<string | null>(this.getStoredToken());
  private readonly user = signal<AuthUser | null>(null);

  readonly currentUser = computed(() => this.user());
  readonly isLoggedIn = computed(() => !!this.token());
  readonly tokenValue = this.token.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    if (this.token()) {
      this.fetchMe().subscribe();
    }
  }

  login(email: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          this.setToken(res.data.token);
          this.user.set(res.data.user);
        })
      );
  }

  signup(email: string, password: string, passwordConfirmation: string): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.baseUrl}/signup`, {
        user: { email, password, password_confirmation: passwordConfirmation },
      })
      .pipe(
        tap((res) => {
          this.setToken(res.data.token);
          this.user.set(res.data.user);
        })
      );
  }

  logout(): void {
    this.http.delete(`${this.baseUrl}/logout`, { headers: this.authHeaders() }).subscribe();
    this.clearSession();
    this.router.navigate(['/login']);
  }

  clearSession(): void {
    this.clearAuth();
  }

  getToken(): string | null {
    return this.token();
  }

  private fetchMe(): Observable<ApiResponse<{ id: string; email: string } | null>> {
    return this.http
      .get<ApiResponse<{ id: string; email: string } | null>>(`${this.baseUrl}/me`, {
        headers: this.authHeaders(),
      })
      .pipe(
        tap((res) => {
          if (res.data) {
            this.user.set(res.data);
          } else {
            this.clearAuth();
          }
        })
      );
  }

  private setToken(token: string): void {
    this.token.set(token);
    localStorage.setItem(TOKEN_KEY, token);
  }

  private clearAuth(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  authHeaders(): { [key: string]: string } {
    const t = this.token();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
}
