import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RickAndMortyService } from '../rick-and-morty.service';

@Component({
  standalone: true,
  imports: [NgIf, NgForOf, RouterModule, AsyncPipe],
  template: `
    <ng-container *ngIf="episodes$ | async as episodes">
      <p *ngIf="episodes.status === 'pending'">Loading...</p>
      <p *ngIf="episodes.status === 'error'">Error :(</p>
      <ng-container *ngIf="episodes.status === 'success'">
        <article class="py-1" *ngFor="let episode of episodes.data.results">
          <a class="link-secondary" [routerLink]="[episode.id]">
            {{ episode.episode }} - {{ episode.name }}
          </a>
        </article>
      </ng-container>
    </ng-container>
  `,
})
export class EpisodesComponent {
  apiService = inject(RickAndMortyService);
  episodes$ = this.apiService.getEpisodes().result$;
}
