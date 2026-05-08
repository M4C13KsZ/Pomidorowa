import { Injectable, signal, computed, OnDestroy } from '@angular/core';

export type TimerPhase = 'work' | 'break' | 'idle';

const WORK_SECONDS = 25 * 60;   // 1500
const BREAK_SECONDS = 5 * 60;   // 300

@Injectable({ providedIn: 'root' })
export class TimerService implements OnDestroy {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  remaining = signal(WORK_SECONDS);
  phase = signal<TimerPhase>('idle');
  running = signal(false);
  /** True when a full 25-min work session just completed (caller should save + propose break) */
  sessionCompleted = signal(false);

  display = computed(() => {
    const s = this.remaining();
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  });

  /** 0.0 → 1.0, used for SVG ring progress */
  progress = computed(() => {
    const total = this.phase() === 'break' ? BREAK_SECONDS : WORK_SECONDS;
    return this.remaining() / total;
  });

  start(phase: TimerPhase = 'work'): void {
    this.sessionCompleted.set(false);
    if (this.phase() !== phase) {
      this.remaining.set(phase === 'work' ? WORK_SECONDS : BREAK_SECONDS);
      this.phase.set(phase);
    }
    this.running.set(true);
    this.clearInterval();
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  pause(): void {
    this.running.set(false);
    this.clearInterval();
  }

  stop(): void {
    this.running.set(false);
    this.clearInterval();
    this.remaining.set(WORK_SECONDS);
    this.phase.set('idle');
    this.sessionCompleted.set(false);
  }

  startBreak(): void {
    this.start('break');
  }

  private tick(): void {
    const current = this.remaining();
    if (current <= 1) {
      this.remaining.set(0);
      this.running.set(false);
      this.clearInterval();
      if (this.phase() === 'work') {
        this.sessionCompleted.set(true);
      }
      this.playBeep();
    } else {
      this.remaining.update(r => r - 1);
    }
  }

  private playBeep(): void {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // AudioContext unavailable (e.g. tests)
    }
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }
}