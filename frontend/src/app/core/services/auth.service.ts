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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
