
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models';

@Injectable({ providedIn: 'root' })
export class TaskService {
    private readonly API = '/api/tasks';

    constructor(private http: HttpClient) { }

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.API);
    }

    createTask(name: string): Observable<Task> {
        return this.http.post<Task>(this.API, { name });
    }

    updateTask(id: number, name: string): Observable<Task> {
        return this.http.put<Task>(`${this.API}/${id}`, { name });
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API}/${id}`);
    }
}