import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubscribeModule } from '@ngneat/subscribe';
import { BehaviorSubject, ReplaySubject, switchMap } from 'rxjs';
import { RickAndMortyService, Character } from '../rick-and-morty.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'ng-query-prefetching',
  standalone: true,
  imports: [CommonModule, SubscribeModule, SpinnerComponent],
  template: `
    <p>
      Hovering over a character will prefetch it, and when it's been prefetched
      it will turn <strong>bold</strong>. Clicking on a prefetched character
      will show their stats below immediately.
    </p>

    <div class="grid grid-cols-2 gap-8">
      <section *subscribe="characters$ as characters">
        <ng-query-spinner *ngIf="characters.isLoading"></ng-query-spinner>

        <ul class="list-group" *ngIf="characters.isSuccess">
          <li
            class="list-group-item"
            *ngFor="let character of characters.data; trackBy: trackBy"
            (click)="selectCharacter(character)"
            (mouseenter)="prefetchCharacter(character)"
          >
            {{ character.name }}
          </li>
        </ul>
      </section>

      <section *subscribe="selectedCharacter$ as selectedCharacter">
        <ng-query-spinner
          *ngIf="selectedCharacter.isLoading"
        ></ng-query-spinner>
        <ng-container *ngIf="selectedCharacter.isSuccess">
          <img [src]="selectedCharacter.data.image" alt="" srcset="" />
          <div>{{ selectedCharacter.data.name }}</div>
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

  private selectedCharacterId = new BehaviorSubject<number>(1);
  selectedCharacter$ = this.selectedCharacterId
    .asObservable()
    .pipe(switchMap((id: number) => this.service.getCharacter(id).result$));

  prefetchCharacter(character: Character) {
    this.service.prefetchCharacter(character.id);
  }

  selectCharacter(character: Character) {
    this.selectedCharacterId.next(character.id);
  }

  trackBy(_: number, character: { id: number }) {
    return character.id;
  }
}
