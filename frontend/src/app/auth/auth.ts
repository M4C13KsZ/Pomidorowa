import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

type Tab = 'login' | 'register';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
})
export class AuthComponent {
  activeTab = signal<Tab>('login');
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.error.set('');
    this.email = '';
    this.password = '';
  }

  submit(): void {
    this.error.set('');
    if (!this.email.includes('@')) {
      this.error.set('Podaj poprawny adres email.');
      return;
    }
    if (this.password.length < 8) {
      this.error.set('Hasło musi mieć minimum 8 znaków.');
      return;
    }

    this.loading.set(true);
    const action = this.activeTab() === 'login'
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.email, this.password);

    action.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err.error?.error ?? 'Coś poszło nie tak.');
        this.loading.set(false);
      },
    });
  }
}
