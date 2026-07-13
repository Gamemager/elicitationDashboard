// src/app/features/detalle/detalle.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ElicitationService } from '../../core/services/elicitation.service';
import {
  ElicitationDetail, ElicitationStatus,
  NoteRow, STATUS_LABELS, MOSCOW_LABELS,
} from '../../core/models/elicitation.model';

type ActiveTab = 'info' | 'notas' | 'estado';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css',
})
export class DetalleComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private svc    = inject(ElicitationService);
  private auth   = inject(AuthService);

  solicitud     = signal<ElicitationDetail | null>(null);
  notes         = signal<NoteRow[]>([]);
  loading       = signal(true);
  error         = signal('');
  activeTab     = signal<ActiveTab>('info');
  newNote       = signal('');
  savingNote    = signal(false);
  savingStatus  = signal(false);
  selectedStatus = signal<ElicitationStatus>(ElicitationStatus.PENDING);
  statusMsg     = signal('');

  readonly STATUS_LABELS     = STATUS_LABELS;
  readonly MOSCOW_LABELS     = MOSCOW_LABELS;
  readonly ElicitationStatus = ElicitationStatus;

  readonly statusOptions = [
    { value: ElicitationStatus.PENDING,     label: 'Pendiente'   },
    { value: ElicitationStatus.REVIEWED,    label: 'Revisado'    },
    { value: ElicitationStatus.IN_PROGRESS, label: 'En progreso' },
    { value: ElicitationStatus.CLOSED,      label: 'Cerrado'     },
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.router.navigate(['/solicitudes']); return; }

    this.svc.getOne(id).subscribe({
      next: data => {
        this.solicitud.set(data);
        this.selectedStatus.set(data.status);
        this.loading.set(false);
        this.loadNotes(id);
      },
      error: () => {
        this.error.set('No se encontró la solicitud.');
        this.loading.set(false);
      },
    });
  }

  private loadNotes(id: number): void {
    this.svc.getNotes(id).subscribe({
      next: notes => this.notes.set(notes),
    });
  }

  setTab(tab: ActiveTab): void { this.activeTab.set(tab); }

  addNote(): void {
    const content = this.newNote().trim();
    const id = this.solicitud()?.id;
    if (!content || !id) return;

    this.savingNote.set(true);
    this.svc.createNote(id, content).subscribe({
      next: note => {
        this.notes.update(n => [...n, note]);
        this.newNote.set('');
        this.savingNote.set(false);
      },
      error: () => this.savingNote.set(false),
    });
  }

  saveStatus(): void {
    const id = this.solicitud()?.id;
    if (!id) return;

    this.savingStatus.set(true);
    this.statusMsg.set('');
    this.svc.updateStatus(id, this.selectedStatus()).subscribe({
      next: () => {
        this.solicitud.update(s => s ? { ...s, status: this.selectedStatus() } : s);
        this.savingStatus.set(false);
        this.statusMsg.set('Estado actualizado correctamente.');
        setTimeout(() => this.statusMsg.set(''), 3000);
      },
      error: () => {
        this.savingStatus.set(false);
        this.statusMsg.set('Error al actualizar el estado.');
      },
    });
  }

  goBack(): void { this.router.navigate(['/solicitudes']); }
  logout(): void { this.auth.logout(); }

  statusBadgeClass(status: ElicitationStatus): string {
    const map: Record<ElicitationStatus, string> = {
      pending:     'badge-pending',
      reviewed:    'badge-reviewed',
      in_progress: 'badge-in_progress',
      closed:      'badge-closed',
    };
    return map[status] ?? '';
  }
}