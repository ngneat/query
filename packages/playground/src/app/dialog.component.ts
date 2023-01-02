import { Component, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { QueryClientService, UseQuery } from '@ngneat/query';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

const API_URL = 'https://random-data-api.com/api/v2/users?size=3';

@Component({
  selector: 'ng-query-custom-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog open>
      <ng-container *ngIf="characters$ | async as characters">
        <p *ngIf="characters.status === 'loading'">Loading...</p>
        <p *ngIf="characters.status === 'error'">Error :(</p>
        <ng-container *ngIf="characters.status === 'success'">
          <article *ngFor="let person of characters.data">
            {{ person.id }} - {{ person.first_name }} {{ person.last_name }}
          </article>
        </ng-container>
      </ng-container>
    </dialog>
  `,
})
export class DialogComponent {
  http = inject(HttpClient);
  useQuery = inject(UseQuery);
  queryClient = inject(QueryClientService);
  dialog = true;
  characters$;

  constructor() {
    const f = () => this.http.get<any>(API_URL);
    f['aaa'] = 'dialog';

    this.characters$ = this.useQuery(['characters'], f).result$;
  }
}
