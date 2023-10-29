import {AsyncPipe, NgIf} from '@angular/common';
import {Component, inject, Input} from '@angular/core';
import {ReplaySubject, switchMap} from 'rxjs';
import {RickAndMortyService} from '../rick-and-morty.service';

@Component({
  standalone: true,
  selector: 'ng-query-location',
  imports: [NgIf, AsyncPipe],
  template: ` <ng-container *ngIf="location$ | async as location">
    <p *ngIf="location.status === 'pending'">Loading...</p>
    <p *ngIf="location.status === 'error'">Error :(</p>
    <ng-container *ngIf="location.status === 'success'">
      {{ location.data.name }} - {{ location.data.type }}
    </ng-container>
  </ng-container>`,
})
export class LocationComponent {
  apiService = inject(RickAndMortyService);
  locationId$ = new ReplaySubject<string>(1);
  location$ = this.locationId$.pipe(
    switchMap((locationId) => this.apiService.getLocation(locationId).result$)
  );

  @Input() set locationUrl(value: string) {
    const locationUrlPars = value.split('/').filter(Boolean);
    const locationId = locationUrlPars[locationUrlPars.length - 1];
    this.locationId$.next(locationId);
  }
}
