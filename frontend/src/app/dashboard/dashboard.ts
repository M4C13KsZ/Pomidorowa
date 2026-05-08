import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { TaskService } from '../core/services/task.service';
import { SessionService } from '../core/services/session.service';
import { TimerService } from '../core/services/timer.service';
import { TimerComponent } from './timer.component';
import { Task, TodayStats } from '../core/models';

// Component for the main productivity dashboard

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TimerComponent],
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

  addTask(): void {
    const name = this.newTaskName.trim();
    if (!name) return;
    this.taskService.createTask(name).subscribe({
      next: (task) => {
        this.tasks.update(ts => [task, ...ts]);
        this.newTaskName = '';
      },
    });
  }

  startEditTask(task: Task): void {
    this.editingTask.set(task);
    this.editingName = task.name;
  }

  saveEditTask(): void {
    const task = this.editingTask();
    if (!task || !this.editingName.trim()) return;
    this.taskService.updateTask(task.id, this.editingName.trim()).subscribe({
      next: (updated) => {
        this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
        if (this.selectedTask()?.id === updated.id) this.selectedTask.set(updated);
        this.editingTask.set(null);
      },
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks.update(ts => ts.filter(t => t.id !== task.id));
        if (this.selectedTask()?.id === task.id) {
          this.timer.stop();
          this.selectedTask.set(null);
        }
      },
    });
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
