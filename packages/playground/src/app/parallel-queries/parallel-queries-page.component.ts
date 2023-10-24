import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';
import {Component, inject} from '@angular/core';
import {mapResultsData, QueryClientService} from '@ngneat/query';
import {SubscribeModule} from '@ngneat/subscribe';
import {combineLatest, Subject, switchMap} from 'rxjs';
import {GithubApiService} from '../github.service';

@Component({
  standalone: true,
  imports: [NgIf, SubscribeModule, AsyncPipe, JsonPipe],
  template: `
    <ng-container *ngIf="repo$ | async as repo">
      <p *ngIf="repo.isLoading">Loading...</p>
      <p *ngIf="repo.error">An error has occurred: {{ repo.error }}</p>
      <div *ngIf="repo.isSuccess">
        <p><b>ngneat/query</b> {{ repo.data.ngQuery | json }}</p>
        <p><b>ngneat/spectator</b> {{ repo.data.spectator | json }}</p>
      </div>
      <div *ngIf="repo.isFetching">Updating...</div>
    </ng-container>
    <button (click)="invalidate()">Invalidate Queries</button>
    <button (click)="btn.next()">Switch to new Queries</button>
  `
})
export class ParallelQueriesPageComponent {
  client = inject(QueryClientService);
  btn = new Subject<void>();

  constructor(private githubApiService: GithubApiService) {
  }

  repo$ = this.btn.pipe(
    switchMap(() => combineLatest([
      this.githubApiService.getRepository('ngneat/ng-query').result$,
      this.githubApiService.getRepository('ngneat/spectator').result$
    ])),
    mapResultsData(([ngQuery, spectator]) => {
      return {
        ngQuery,
        spectator
      };
    })
  );

  invalidate() {
    this.client.invalidateQueries(['repository', 'ngneat/ng-query']);
    this.client.invalidateQueries(['repository', 'ngneat/spectator']);
  }
}
