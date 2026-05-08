import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(email: string, password: string): Observable<any> {
    console.log('Login attempt', email);
    return of({ token: 'dummy-token' });
  }

  register(email: string, password: string): Observable<any> {
    console.log('Register attempt', email);
    return of({ token: 'dummy-token' });
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
