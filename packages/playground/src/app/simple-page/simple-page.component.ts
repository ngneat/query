import {AsyncPipe, NgIf} from '@angular/common';
import {Component, inject} from '@angular/core';
import {QueryClientService} from '@ngneat/query';
import {BehaviorSubject, switchMap} from 'rxjs';
import {GithubApiService} from '../github.service';

@Component({
  standalone: true,
  imports: [NgIf, AsyncPipe],
  template: `
    <ng-container *ngIf="repo$ | async as repo">
      <p *ngIf="repo.isLoading">Loading...</p>
      <p *ngIf="repo.error">An error has occurred: {{ repo.error }}</p>
      <div *ngIf="repo.isSuccess">
        <h1>{{ repo.data.name }}</h1>
        <p>{{ repo.data.description }}</p>
        <strong>👀 {{ repo.data.subscribers_count }}</strong>
        <strong>✨ {{ repo.data.stargazers_count }}</strong>
        <strong>🍴 {{ repo.data.forks_count }}</strong>
      </div>
      <div *ngIf="repo.isFetching">Updating...</div>
    </ng-container>
    <button (click)="btn.next(true)">Invalidate</button>
  `,
})
export class SimplePageComponent {
  client = inject(QueryClientService);
  btn = new BehaviorSubject(true);
  constructor(private githubApiService: GithubApiService) {}

  repo$ = this.btn.pipe(
    switchMap(() => {
      return this.githubApiService.getRepository('ngneat/ng-query').result$;
    })
  );

  invalidate() {
    this.client.invalidateQueries({queryKey: ['repository', 'ngneat/ng-query']});
  }
}
