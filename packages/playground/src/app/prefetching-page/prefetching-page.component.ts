import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubscribeModule } from '@ngneat/subscribe';
import { BehaviorSubject, switchMap } from 'rxjs';
import { RickAndMortyService } from '../rick-and-morty.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Character } from '../types/rick-morty.types';

@Component({
  selector: 'ng-query-prefetching',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,
    SubscribeModule,
    SpinnerComponent,
  ],
  template: `
    <p>
      Hovering over a character will prefetch it, and when it's been prefetched
      it will turn <strong>bold</strong>. Clicking on a prefetched character
      will show their stats below immediately.
    </p>

    <div class="grid grid-cols-2 gap-8">
      <section *subscribe="characters$ as characters">
        <h2>Characters</h2>
        <ng-query-spinner *ngIf="characters.isLoading"></ng-query-spinner>

        <ul class="list-group" *ngIf="characters.isSuccess">
          <li
            *ngFor="let character of characters.data; trackBy: trackBy"
            (click)="selectCharacter(character)"
            (mouseenter)="prefetchCharacter(character)"
            [class.font-bold]="isCharacterPrefetched(character) | async"
            class="list-group-item hover:bg-sky-100"
          >
            {{ character.name }}
          </li>
        </ul>
      </section>

      <section *subscribe="selectedCharacter$ as selectedCharacter">
        <h2>Selected character</h2>
        <ng-query-spinner
          *ngIf="selectedCharacter.isLoading"
        ></ng-query-spinner>
        <ng-container *ngIf="selectedCharacter.isSuccess">
          <img
            [src]="selectedCharacter.data.image"
            [alt]="selectedCharacter.data.name"
          />
          <pre>{{ selectedCharacter.data | json }}</pre>
        </ng-container>
      </section>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrefetchingPageComponent {
  private service = inject(RickAndMortyService);
  characters$ = this.service.getCharacters().result$;

  private selectedCharacterId = new BehaviorSubject(1);
  selectedCharacter$ = this.selectedCharacterId
    .asObservable()
    .pipe(switchMap((id) => this.service.getCharacter(id).result$));

  prefetchCharacter(character: Character) {
    this.service.prefetchCharacter(character.id);
  }

  isCharacterPrefetched(character: Character) {
    return this.service.isCharacterPrefetched(character.id);
  }

  selectCharacter(character: Character) {
    this.selectedCharacterId.next(character.id);
  }

  trackBy(_: number, character: { id: number }) {
    return character.id;
  }
}
