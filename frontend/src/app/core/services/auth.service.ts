import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API = '/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/login`, { email, password }).pipe(
      tap((res: any) => this.storeSession(res))
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/register`, { email, password }).pipe(
      tap((res: any) => this.storeSession(res))
    );
  }

  private storeSession(res: any): void {
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
