import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', Validators.required],
    },
    { validators: (g) => (g.value.password === g.value.passwordConfirmation ? null : { mismatch: true }) }
  );
  readonly loading = signal(false);

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.auth
      .signup(this.form.value.email!, this.form.value.password!, this.form.value.passwordConfirmation!)
      .subscribe({
        next: () => {
          this.toast.success('Account created. Welcome!');
          this.router.navigate(['/']);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
