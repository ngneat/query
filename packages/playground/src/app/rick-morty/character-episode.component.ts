import { NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscribeModule } from '@ngneat/subscribe';
import { ReplaySubject, filter, switchMap } from 'rxjs';
import { RickAndMortyService } from '../rick-and-morty.service';

@Component({
  standalone: true,
  imports: [NgIf, SubscribeModule, RouterModule],
  selector: 'ng-query-character-episode',
  template: `
    <ng-container *subscribe="episode$ as episode">
      <p *ngIf="episode.status === 'loading'">Loading...</p>
      <p *ngIf="episode.status === 'error'">Error :(</p>
      <ng-container *ngIf="episode.status === 'success'">
        <article class="py-1">
          <a
            class="link-secondary"
            [routerLink]="['/rick-morty', 'episodes', episode.data.id]"
          >
            {{ episode.data.episode }}. {{ episode.data.name }} -
            {{ episode.data.air_date }}
          </a>
        </article>
      </ng-container>
    </ng-container>
  `,
})
export class CharacterEpisodeComponent {
  apiService = inject(RickAndMortyService);
  episodeId = new ReplaySubject<string>(1);
  episode$ = this.episodeId.pipe(
    filter(Boolean),
    switchMap((episodeId) => this.apiService.getEpisode(episodeId).result$)
  );

  @Input() set episode(value: string) {
    const episodeUrlParts = value.split('/').filter(Boolean);
    const episodeId = episodeUrlParts[episodeUrlParts.length - 1];
    this.episodeId.next(episodeId);
  }
}
