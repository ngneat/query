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
  private query = injectQuery();
  private client = injectQueryClient();

  getProjects(page: number) {
    return this.query({
      queryKey: ['projects', page],
      queryFn: ({ signal }) => {
        const source = fetchProjects(page);

        return toPromise({ source, signal });
      },
      placeholderData: keepPreviousData,
      staleTime: 5000,
    });
  }

  prefetch(page: number) {
    return this.client.prefetchQuery({
      queryKey: ['projects', page],
      queryFn: ({ signal }) => {
        const source = fetchProjects(page);

        return toPromise({ source, signal });
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
