import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ngQueryDevtools } from '@ng-query/ng-query-devtools';
import { QUERY_CLIENT } from '@ngneat/ng-query';

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

    <main class="container py-3">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent implements AfterViewInit {
  private queryClient = inject(QUERY_CLIENT);
  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    // Type 'import("/Users/ducnguyen/code/ng-query/node_modules/@tanstack/query-core/build/lib/queryClient").QueryClient' is not assignable to type 'import("/Users/ducnguyen/code/ng-query/node_modules/@tanstack/react-query/node_modules/@tanstack/query-core/build/lib/queryClient").QueryClient'.
    // @ts-ignore
    ngQueryDevtools({ queryClient: this.queryClient });
  }
}
