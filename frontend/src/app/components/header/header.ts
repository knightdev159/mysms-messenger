import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="app-header" role="banner">
      <a routerLink="/" class="app-header__brand" aria-label="MySMS Messenger home">
        MySMS Messenger
      </a>
      @if (auth.currentUser(); as user) {
        <div class="app-header__user">
          <span class="app-header__email">{{ user.email }}</span>
          <button type="button" class="app-header__logout" (click)="auth.logout()" aria-label="Log out">
            Log out
          </button>
        </div>
      }
    </header>
  `,
  styles: `
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #1e3a5f;
      color: #fff;
      padding: 1rem 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .app-header__brand {
      font-size: 1.35rem;
      font-weight: 700;
      color: #fff;
      text-decoration: none;
      letter-spacing: -0.02em;
    }

    .app-header__brand:hover {
      color: #e0e7ff;
    }

    .app-header__brand:focus-visible {
      outline: 2px solid #818cf8;
      outline-offset: 4px;
      border-radius: 4px;
    }

    .app-header__user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .app-header__email {
      font-size: 0.9rem;
      color: #e0e7ff;
    }

    .app-header__logout {
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.5);
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .app-header__logout:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `,
})
export class HeaderComponent {
  protected auth = inject(AuthService);
}
