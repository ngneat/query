import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'ng-query-root',
  template: `
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">NgQuery</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLinkActive="active"
                aria-current="page"
                routerLink=""
                >Simple</a
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLinkActive="active"
                aria-current="page"
                routerLink="basic"
                >Basic</a
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLinkActive="active"
                aria-current="page"
                routerLink="mutations"
                >Mutations</a
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLinkActive="active"
                aria-current="page"
                routerLink="infinite"
                >Infinite Query</a
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLinkActive="active"
                aria-current="page"
                routerLink="pagination"
                >Pagination</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container py-3 main">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {}
