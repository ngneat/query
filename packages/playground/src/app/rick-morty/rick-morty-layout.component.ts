import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="nav">
      <a
        class="nav-link link-primary"
        routerLink="/rick-morty"
        routerLinkActive="link-success"
        [routerLinkActiveOptions]="{ exact: true }"
        >Home</a
      >
      <a
        class="nav-link link-primary"
        routerLink="/rick-morty/episodes"
        routerLinkActive="link-success"
        >Episodes</a
      >
      <a
        class="nav-link link-primary"
        routerLink="/rick-morty/characters"
        routerLinkActive="link-success"
        >Characters</a
      >
    </nav>

    <div class="px-3">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class RickMortyLayoutComponent {}
