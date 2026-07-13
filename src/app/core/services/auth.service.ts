import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  success: boolean;
  data: { token: string };
}
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'elite_token';
 
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/api/v1/auth/login`, { username, password })
      .pipe(
        tap(res => {
          if (res.success && res.data?.token) {
            sessionStorage.setItem(this.TOKEN_KEY, res.data.token);
          }
        }),
      );
  }
 
  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
 
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
 
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      // Verificar expiración decodificando el payload del JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
