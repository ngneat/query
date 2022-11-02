import { NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscribeModule } from '@ngneat/subscribe';
import { RickAndMortyService } from '../rick-and-morty.service';

@Component({
  standalone: true,
  imports: [NgIf, NgForOf, SubscribeModule, RouterModule],
  template: ` <ng-container *subscribe="characters$ as characters">
    <p *ngIf="characters.status === 'loading'">Loading...</p>
    <p *ngIf="characters.status === 'error'">Error :(</p>
    <ng-container *ngIf="characters.status === 'success'">
      <article class="py-1" *ngFor="let person of characters.data">
        <a class="link-secondary" [routerLink]="[person.id]">
          {{ person.name }} - {{ person.gender }}: {{ person.species }}
        </a>
      </article>
    </ng-container>
  </ng-container>`,
})
export class CharactersComponent {
  apiService = inject(RickAndMortyService);
  characters$ = this.apiService.getCharacters().result$;
}
