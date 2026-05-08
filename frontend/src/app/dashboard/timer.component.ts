import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerService } from '../core/services/timer.service';
import { Task } from '../core/models';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
})
export class TimerComponent {
  @Input() selectedTask: Task | null = null;

  constructor(public timer: TimerService) {}

  startWork(): void {
    if (this.selectedTask) {
      this.timer.start('work');
    }
  }

  pause(): void {
    this.timer.pause();
  }

  resume(): void {
    const currentPhase = this.timer.phase();
    const phaseToStart = currentPhase === 'break' ? 'break' : 'work';
    this.timer.start(phaseToStart);
  }

  stop(): void {
    this.timer.stop();
  }
}
