import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../core/services/session.service';
import { TodayStats } from '../core/models';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
})
export class StatsComponent implements OnInit {
  stats = signal<TodayStats | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.sessionService.getTodayStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nie udało się załadować statystyk.');
        this.loading.set(false);
      },
    });
  }

  get totalTimeLabel(): string {
    const s = this.stats()?.totalSeconds ?? 0;
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}min`;
    return `${m} minut`;
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  }

  formatDuration(s: number): string {
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
