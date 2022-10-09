import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { QueryProvider } from '@ngneat/ng-query';
import { SubscribeModule } from '@ngneat/subscribe';

interface Repository {
  name: string;
  description: string;
  subscribers_count: number;
  stargazers_count: number;
  forks_count: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, SubscribeModule],
  template: `
    <ng-container *subscribe="repo$ as repo">
      <p *ngIf="repo.isLoading">Loading...</p>
      <p *ngIf="repo.error">An error has occurred: {{ repo.error }}</p>

      <div *ngIf="repo.isSuccess">
        <h1>{{repo.data.name }}</h1>
        <p>{{repo.data.description }}</p>
        <strong>👀 {{repo.data.subscribers_count }}</strong>
        <strong>✨ {{repo.data.stargazers_count }}</strong>
        <strong>🍴 {{repo.data.forks_count }}</strong>
        <div>{{repo.isFetching ? "Updating..." :  ""}}</div>
      </div>
    </ng-container>
  `,
})
export class SimplePageComponent {
  useQuery = inject(QueryProvider);
  http = inject(HttpClient);

  repo$ = this.useQuery(['repoData'], () =>
    this.http.get<Repository>('https://api.github.com/repos/ngneat/ng-query')
  );
}
