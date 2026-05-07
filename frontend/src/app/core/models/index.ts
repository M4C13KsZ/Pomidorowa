export interface User {
    id: number;
    email: string;
}

export interface Task {
    id: number;
    userId: number;
    name: string;
    isActive: boolean;
    createdAt: string;
}

export interface Session {
    id: number;
    userId: number;
    taskId: number | null;
    taskName: string;
    durationSeconds: number;
    completedAt: string;
}

export interface TaskSummary {
    taskName: string;
    pomodoros: number;
}

export interface TodayStats {
    totalSeconds: number;
    totalPomodoros: number;
    sessions: Session[];
    taskSummary: TaskSummary[];
}