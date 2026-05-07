import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { TaskService } from '../core/services/task.service';
import { SessionService } from '../core/services/session.service';
import { TimerService } from '../core/services/timer.service';
import { Task, TodayStats } from '../core/models';

// Component for the main productivity dashboard

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  tasks = signal<Task[]>([]);
  selectedTask = signal<Task | null>(null);
  newTaskName = '';
  editingTask = signal<Task | null>(null);
  editingName = '';
  showBreakPrompt = signal(false);
  stats = signal<TodayStats | null>(null);

  private sub: Subscription | null = null;

  constructor(
    public auth: AuthService,
    private taskService: TaskService,
    private sessionService: SessionService,
    public timer: TimerService,
    private router: Router
  ) {
    effect(() => {
      if (this.timer.sessionCompleted()) {
        this.onSessionCompleted();
      }
    });
  }

  ngOnInit(): void {
    this.loadTasks();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        const sel = this.selectedTask();
        if (sel) {
          this.selectedTask.set(tasks.find(t => t.id === sel.id) ?? null);
        }
      },
      error: () => this.auth.logout(),
    });
  }

  loadStats(): void {
    this.sessionService.getTodayStats().subscribe({
      next: (data) => this.stats.set(data),
    });
  }

  selectAndStart(task: Task): void {
    this.selectedTask.set(task);
    this.showBreakPrompt.set(false);
    this.timer.start('work');
  }

  pause(): void  { this.timer.pause(); }
  resume(): void { this.timer.start(this.timer.phase() === 'break' ? 'break' : 'work'); }

  stop(): void {
    this.timer.stop();
    this.showBreakPrompt.set(false);
  }

  startBreak(): void {
    this.showBreakPrompt.set(false);
    this.timer.startBreak();
  }

  skipBreak(): void {
    this.showBreakPrompt.set(false);
    this.timer.stop();
  }

  private onSessionCompleted(): void {
    const task = this.selectedTask();
    this.sessionService.saveSession(task?.id ?? null, task?.name ?? 'Nieznane zadanie').subscribe({
      next: () => this.loadStats()
    });
    this.showBreakPrompt.set(true);
  }

  logout(): void {
    this.timer.stop();
    this.auth.logout();
  }

  navigateToStats(): void {
    this.router.navigate(['/stats']);
  }
}
