import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UseQuery } from '@ngneat/query';

interface Repository {
  name: string;
  description: string;
  subscribers_count: number;
  stargazers_count: number;
  forks_count: number;
}

@Injectable({
  providedIn: 'root',
})
export class GithubApiService {
  http = inject(HttpClient);
  useQuery = inject(UseQuery);

  getRepository(repositoryName: string) {
    return this.useQuery(['repository', repositoryName], () =>
      this.http.get<Repository>(`https://reqres.in/api/users?delay=5`)
    );
  }
}
