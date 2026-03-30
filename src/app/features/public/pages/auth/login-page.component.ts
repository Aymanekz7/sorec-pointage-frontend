import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  username = '';
  password = '';
  showPassword = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  submit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Veuillez renseigner votre identifiant et votre mot de passe.';
      return;
    }

    const isValid = this.sessionService.login(this.username, this.password);
    if (!isValid) {
      this.errorMessage = 'Identifiants invalides. Utilisez les comptes de demonstration.';
      return;
    }

    this.errorMessage = '';
    if (this.sessionService.isPublic()) {
      this.router.navigateByUrl('/public-presence');
      return;
    }

    this.router.navigateByUrl('/dashboard');
  }
}
