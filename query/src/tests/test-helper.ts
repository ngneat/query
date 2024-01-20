import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map, timer } from 'rxjs';
import { injectInfiniteQuery } from '../lib/infinite-query';
import { injectQuery } from '../lib/query';
import { injectQueryClient } from '../lib/query-client';
import { queryOptions } from '../lib/query-options';

export interface Todo {
  id: number;
}

export const getObservableTodosQuery = () => ({
  queryKey: ['todos'] as const,
  queryFn: () => {
    return timer(1000).pipe(
      map(() => {
        return [
          {
            id: 1,
          },
          { id: 2 },
        ] as Todo[];
      }),
    );
  },
});
export const getPromiseTodosQuery = () => ({
  queryKey: ['todos'] as const,
  queryFn: () => {
    return lastValueFrom(
      timer(1000).pipe(
        map(() => {
          return [
            {
              id: 1,
            },
            { id: 2 },
          ] as Todo[];
        }),
      ),
    );
  },
});

@Injectable({ providedIn: 'root' })
export class TodosService {
  #client = injectQueryClient();
  #query = injectQuery();

  #getTodosOptions = queryOptions(getObservableTodosQuery());

  getTodos() {
    return this.#query(this.#getTodosOptions);
  }

  getCachedTodos() {
    return this.#client.getQueryData(this.#getTodosOptions.queryKey);
  }
}

interface Post {
  id: number;
  name: string;
}

export interface Posts {
  data: Post[];
  nextId: number | null;
  previousId: number | null;
}

export const getObservablePostsQuery = () => ({
  queryKey: ['posts'],
  queryFn: (x: { pageParam: number }) => {
    return getProjects(x.pageParam);
  },
  initialPageParam: 0,
  getPreviousPageParam: (firstPage: Posts) => firstPage.previousId,
  getNextPageParam: (lastPage: Posts) => lastPage.nextId,
});

export const getPromisePostsQuery = () => ({
  queryKey: ['posts'],
  queryFn: (x: { pageParam: number }) => {
    return lastValueFrom(getProjects(x.pageParam));
  },
  initialPageParam: 0,
  getPreviousPageParam: (firstPage: Posts) => firstPage.previousId,
  getNextPageParam: (lastPage: Posts) => lastPage.nextId,
});

@Injectable({ providedIn: 'root' })
export class PostsService {
  #query = injectInfiniteQuery();
  #client = injectQueryClient();

  #postsQueryOptions = queryOptions(getObservablePostsQuery());

  getPosts() {
    return this.#query(this.#postsQueryOptions);
  }

  getCachedPosts() {
    return this.#client.getQueryData(this.#postsQueryOptions.queryKey);
  }
}

function getProjects(c: number) {
  return new Observable<Posts>((observer) => {
    const cursor = c || 0;
    const pageSize = 5;

    const data = Array(pageSize)
      .fill(0)
      .map((_, i) => {
        return {
          name: 'Post ' + (i + cursor) + ` (server time: ${Date.now()})`,
          id: i + cursor,
        };
      });

    const nextId = cursor < 20 ? data[data.length - 1].id + 1 : null;
    const previousId = cursor > -20 ? data[0].id - pageSize : null;

    setTimeout(() => {
      observer.next({ data, nextId, previousId });
      observer.complete();
    }, 1000);
  });
}
