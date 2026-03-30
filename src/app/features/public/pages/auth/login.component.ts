import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);

  protected readonly loginForm = this.fb.nonNullable.group({
    matricule: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  protected submitted = false;
  protected authError = '';

  get matriculeControl() {
    return this.loginForm.controls.matricule;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  protected submit(): void {
    this.submitted = true;
    this.authError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { matricule, password } = this.loginForm.getRawValue();
    const username = matricule.trim().toLowerCase();
    const isValid = this.sessionService.login(username, password);

    if (!isValid) {
      this.authError = 'Identifiants invalides. Veuillez verifier votre e-mail et votre mot de passe.';
      return;
    }

    if (this.sessionService.isPublic()) {
      this.router.navigateByUrl('/bureau-public');
      return;
    }

    this.router.navigateByUrl('/dashboard');
  }
}
