import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodayStats } from '../models';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly API = '/api/sessions';

  constructor(private http: HttpClient) {}

  getTodayStats(): Observable<TodayStats> {
    return this.http.get<TodayStats>(`${this.API}/today`);
  }

  saveSession(taskId: number | null, taskName: string): Observable<any> {
    // Assuming standard 25 min work session for now
    return this.http.post(this.API, { 
      taskId, 
      taskName, 
      durationSeconds: 1500 
    });
  }
}
