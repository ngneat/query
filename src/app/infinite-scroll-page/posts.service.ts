import { Injectable } from '@angular/core';
import { injectInfiniteQuery, toPromise } from '@ngneat/query';
import { Observable } from 'rxjs';

interface Post {
  id: number;
  name: string;
}

export interface Posts {
  data: Post[];
  nextId: number | null;
  previousId: number | null;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  #query = injectInfiniteQuery();

  getPosts() {
    return this.#query({
      queryKey: ['posts'],
      queryFn: ({ pageParam, signal }) => {
        return toPromise({
          source: getProjects(pageParam),
          signal,
        });
      },
      initialPageParam: 0,
      getPreviousPageParam: (firstPage) => firstPage.previousId,
      getNextPageParam: (lastPage) => lastPage.nextId,
    });
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
