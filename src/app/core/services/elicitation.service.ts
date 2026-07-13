import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  ElicitationDetail,
  ElicitationStatus,
  ElicitationSummary,
  NoteRow,
} from '../models/elicitation.model';
 
@Injectable({ providedIn: 'root' })
export class ElicitationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/elicitation`;
 
  getAll(): Observable<ElicitationSummary[]> {
    return this.http
      .get<ApiResponse<ElicitationSummary[]>>(this.base)
      .pipe(map(r => r.data ?? []));
  }
 
  getOne(id: number): Observable<ElicitationDetail> {
    return this.http
      .get<ApiResponse<ElicitationDetail>>(`${this.base}/${id}`)
      .pipe(map(r => {
        if (!r.data) throw new Error('No encontrado');
        return r.data;
      }));
  }
 
  updateStatus(id: number, status: ElicitationStatus): Observable<void> {
    return this.http
      .patch<ApiResponse<void>>(`${this.base}/${id}/status`, { status })
      .pipe(map(() => void 0));
  }
 
  getNotes(id: number): Observable<NoteRow[]> {
    return this.http
      .get<ApiResponse<NoteRow[]>>(`${this.base}/${id}/notes`)
      .pipe(map(r => r.data ?? []));
  }
 
  createNote(id: number, content: string): Observable<NoteRow> {
    return this.http
      .post<ApiResponse<NoteRow>>(`${this.base}/${id}/notes`, { content })
      .pipe(map(r => {
        if (!r.data) throw new Error('Error al guardar nota');
        return r.data;
      }));
  }
}