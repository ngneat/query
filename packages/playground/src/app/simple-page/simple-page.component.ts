import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { QueryClient } from '@ngneat/query';
import { SubscribeModule } from '@ngneat/subscribe';
import { GithubApiService } from '../github.service';

@Component({
  standalone: true,
  imports: [CommonModule, SubscribeModule],
  template: `
    <ng-container *subscribe="repo$ as repo">
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

    <button (click)="invalidate()">Invalidate</button>
  `,
})
export class SimplePageComponent {
  client = inject(QueryClient);

  constructor(private githubApiService: GithubApiService) {}

  repo$ = this.githubApiService.getRepository('ngneat/ng-query').result$;

  invalidate() {
    this.client.invalidateQueries(['repository', 'ngneat/ng-query']);
  }
}
