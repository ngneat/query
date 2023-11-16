import { delay, of } from 'rxjs';
import {
  injectQuery,
  injectQueryClient,
  keepPreviousData,
  toPromise,
} from '@ngneat/query';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  #query = injectQuery();
  #client = injectQueryClient();

  getProjects(page: number) {
    return this.#query({
      queryKey: ['projects', page],
      queryFn: () => {
        return fetchProjects(page);
      },
      placeholderData: keepPreviousData,
      staleTime: 5000,
    });
  }

  prefetch(page: number) {
    return this.#client.prefetchQuery({
      queryKey: ['projects', page],
      queryFn: ({ signal }) => {
        return toPromise({ source: fetchProjects(page), signal });
      },
    });
  }
}

function fetchProjects(nextPage: number) {
  const page = nextPage || 0;
  const pageSize = 10;

  const projects = Array(pageSize)
    .fill(0)
    .map((_, i) => {
      const id = page * pageSize + (i + 1);
      return {
        name: 'Project ' + id,
        id,
      };
    });

  return of({ projects, hasMore: page < 9 }).pipe(delay(1000));
}
