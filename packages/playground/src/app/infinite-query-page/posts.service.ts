import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InfiniteQueryProvider } from '@ngneat/ng-query';
import { tap } from 'rxjs';

interface Post {
  id: number;
  userId: string;
  title: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private http = inject(HttpClient);
  private useInfiniteQuery = inject(InfiniteQueryProvider);

  getPosts() {
    return this.useInfiniteQuery<Post[]>(
      ['posts'],
      ({ pageParam = 0 }) => {
        return this.http.get<Post[]>(
          `https://jsonplaceholder.typicode.com/posts?_start=${pageParam}&_limit=1`
        );
      },
      {
        getNextPageParam: (_, allPages) => {
          return allPages?.reduce((acc, curr) => acc + curr.length, 0);
        },
      }
    ).pipe(
      tap((res) => {
        console.log(res);
      })
    );
  }
}
