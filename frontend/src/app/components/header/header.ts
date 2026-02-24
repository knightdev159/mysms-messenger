import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="app-header" role="banner">
      <a href="/" class="app-header__brand" aria-label="MySMS Messenger home">
        MySMS Messenger
      </a>
    </header>
  `,
  styles: `
    .app-header {
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
  `,
})
export class HeaderComponent {}
