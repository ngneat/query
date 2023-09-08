import { NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubscribeModule } from '@ngneat/subscribe';
import { filter, map, switchMap } from 'rxjs';
import { RickAndMortyService } from '../rick-and-morty.service';
import { EpisodeCharacterComponent } from './episode-character.component';

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    SubscribeModule,
    RouterModule,
    EpisodeCharacterComponent,
  ],
  template: `
    <ng-container *subscribe="episode$ as episode">
      <ng-container *ngIf="episode.isSuccess">
        <h2>{{ episode.data.name }}</h2>
        <p>{{ episode.data.air_date }}</p>
        <h3>Characters</h3>
        <ng-query-episode-character
          *ngFor="let character of episode.data.characters"
          [character]="character"
        ></ng-query-episode-character>
      </ng-container>
      <br />
    </ng-container>
  `,
})
export class EpisodeComponent {
  route = inject(ActivatedRoute);
  apiService = inject(RickAndMortyService);
  episodeId$ = this.route.paramMap.pipe(
    map((params) => params.get('episodeId')),
    filter(Boolean)
  );
  episode$ = this.episodeId$.pipe(
    switchMap((episodeId) => this.apiService.getEpisode(episodeId).result$)
  );
}
