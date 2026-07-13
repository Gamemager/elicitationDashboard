import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-logo">
          EDT <span>// dashboard</span>
        </div>
        <p class="login-sub">Módulo ELITE — Acceso administrativo</p>
 
        <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="off">
          <div class="field">
            <label class="form-label">Usuario</label>
            <input class="form-input" formControlName="username"
                   type="text" placeholder="eixon" autocomplete="username">
          </div>
 
          <div class="field">
            <label class="form-label">Contraseña</label>
            <input class="form-input" formControlName="password"
                   type="password" placeholder="••••••••" autocomplete="current-password">
          </div>
 
          <div class="login-error" *ngIf="error()">{{ error() }}</div>
 
          <button class="btn-login" type="submit" [disabled]="loading() || form.invalid">
            {{ loading() ? 'Verificando...' : 'Ingresar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrap {
      min-height: 100vh;
      background: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-card {
      width: 360px;
      border: 1px solid var(--border);
      background: var(--bg2);
      padding: 40px 36px;
    }
    .login-logo {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text);
      margin-bottom: 6px;
    }
    .login-logo span { color: var(--accent); }
    .login-sub {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      margin-bottom: 32px;
      letter-spacing: 0.04em;
    }
    .field { margin-bottom: 16px; }
    .login-error {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--red);
      background: rgba(255,60,95,0.06);
      border: 1px solid rgba(255,60,95,0.2);
      padding: 10px 12px;
      margin-bottom: 16px;
    }
    .btn-login {
      width: 100%;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--bg);
      background: var(--accent);
      border: none;
      padding: 13px;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 4px;
    }
    .btn-login:hover:not(:disabled) { background: #00e6b3; }
    .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
  `],
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
 
  loading = signal(false);
  error   = signal('');
 
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
 
  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
 
    const { username, password } = this.form.value;
 
    this.auth.login(username!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/solicitudes']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Credenciales incorrectas. Verifica usuario y contraseña.');
      },
    });
  }
}