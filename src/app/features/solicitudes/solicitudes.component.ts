import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ElicitationService } from '../../core/services/elicitation.service';
import {
  ElicitationStatus, ElicitationSummary,
  STATUS_LABELS, MOSCOW_LABELS,
} from '../../core/models/elicitation.model';
 
@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [RouterLink, DatePipe, NgFor, NgIf, NgClass],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
})
export class SolicitudesComponent implements OnInit {
  private svc  = inject(ElicitationService);
  private auth = inject(AuthService);
 
  solicitudes = signal<ElicitationSummary[]>([]);
  loading     = signal(true);
  error       = signal('');
  activeFilter = signal<ElicitationStatus | 'all'>('all');
 
  readonly STATUS_LABELS  = STATUS_LABELS;
  readonly MOSCOW_LABELS  = MOSCOW_LABELS;
  readonly ElicitationStatus = ElicitationStatus;
 
  readonly filters: { value: ElicitationStatus | 'all'; label: string }[] = [
    { value: 'all',                           label: 'Todos'       },
    { value: ElicitationStatus.PENDING,       label: 'Pendiente'   },
    { value: ElicitationStatus.REVIEWED,      label: 'Revisado'    },
    { value: ElicitationStatus.IN_PROGRESS,   label: 'En progreso' },
    { value: ElicitationStatus.CLOSED,        label: 'Cerrado'     },
  ];
 
  filtered = computed(() => {
    const f = this.activeFilter();
    return f === 'all'
      ? this.solicitudes()
      : this.solicitudes().filter(s => s.status === f);
  });
 
  counts = computed(() => ({
    total:       this.solicitudes().length,
    pending:     this.solicitudes().filter(s => s.status === ElicitationStatus.PENDING).length,
    in_progress: this.solicitudes().filter(s => s.status === ElicitationStatus.IN_PROGRESS).length,
    reviewed:    this.solicitudes().filter(s => s.status === ElicitationStatus.REVIEWED).length,
    closed:      this.solicitudes().filter(s => s.status === ElicitationStatus.CLOSED).length,
  }));
 
  ngOnInit(): void {
    this.svc.getAll().subscribe({
      next:  data => { this.solicitudes.set(data); this.loading.set(false); },
      error: ()   => { this.error.set('Error al cargar solicitudes.'); this.loading.set(false); },
    });
  }
 
  setFilter(f: ElicitationStatus | 'all'): void {
    this.activeFilter.set(f);
  }
 
  logout(): void { this.auth.logout(); }
 
  statusClass(status: ElicitationStatus): string {
    const map: Record<ElicitationStatus, string> = {
      pending:     'badge-pending',
      reviewed:    'badge-reviewed',
      in_progress: 'badge-in_progress',
      closed:      'badge-closed',
    };
    return map[status] ?? '';
  }
}