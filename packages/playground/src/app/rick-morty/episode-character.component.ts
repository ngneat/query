import { NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscribeModule } from '@ngneat/subscribe';
import { ReplaySubject, filter, switchMap } from 'rxjs';
import { RickAndMortyService } from '../rick-and-morty.service';

@Component({
  standalone: true,
  imports: [NgIf, SubscribeModule, RouterModule],
  selector: 'ng-query-episode-character',
  template: `
    <ng-container *subscribe="character$ as character">
      <p *ngIf="character.status === 'loading'">Loading...</p>
      <p *ngIf="character.status === 'error'">Error :(</p>
      <ng-container *ngIf="character.status === 'success'">
        <article class="py-1">
          <a
            class="link-secondary"
            [routerLink]="['/rick-morty', 'characters', character.data.id]"
          >
            {{ character.data.name }}
          </a>
        </article>
      </ng-container>
    </ng-container>
  `,
})
export class EpisodeCharacterComponent {
  apiService = inject(RickAndMortyService);
  characterId$ = new ReplaySubject<number>(1);
  character$ = this.characterId$.pipe(
    filter(Boolean),
    switchMap(
      (characterId) => this.apiService.getCharacter(characterId).result$
    )
  );

  @Input() set character(value: string) {
    const characterUrlParts = value.split('/').filter(Boolean);
    const characterId = characterUrlParts[characterUrlParts.length - 1];

    this.characterId$.next(+characterId);
  }
}
