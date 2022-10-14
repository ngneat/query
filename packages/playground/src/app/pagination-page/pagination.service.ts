import { inject, Injectable } from '@angular/core';
import { QueryClient, QueryProvider } from '@ngneat/ng-query';
import { delay, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private queryClient = inject(QueryClient);
  private useQuery = inject(QueryProvider);

  getProjects(page = 0) {
    return this.useQuery(
      ['projects', page] as const,
      () => fetchProjects(page),
      {
        keepPreviousData: true,
        staleTime: Infinity,
      }
    );
  }
}

function fetchProjects(nextPage: number) {
  const page = nextPage || 0;
  console.log('fetching ', nextPage);
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
