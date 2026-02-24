import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" (click)="toastService.dismiss(toast.id)">
          <span class="toast__icon">
            @switch (toast.type) {
              @case ('success') { &#10003; }
              @case ('error') { &#10007; }
              @case ('warning') { &#9888; }
              @case ('info') { &#8505; }
            }
          </span>
          <span class="toast__message">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .toast--success { background: #059669; }
    .toast--error { background: #dc2626; }
    .toast--warning { background: #d97706; }
    .toast--info { background: #2563eb; }

    .toast__icon { font-size: 1.1rem; }
    .toast__message { flex: 1; }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
})
export class ToastComponent {
  protected toastService = inject(ToastService);
}
