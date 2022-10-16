import { inject, Injectable } from '@angular/core';
import { QueryClient, QueryProvider } from '@ngneat/query';
import { delay, firstValueFrom, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private queryClient = inject(QueryClient);
  private useQuery = inject(QueryProvider);
  private projectsObserver: ReturnType<
    PaginationService['fetchProjects']
  > | null = null;

  getProjects(page = 0) {
    if (!this.projectsObserver) {
      this.projectsObserver = this.fetchProjects(page);
    } else {
      this.projectsObserver.updateQueryKey(['projects', page]);
    }

    return this.projectsObserver;
  }

  prefetch(page: number) {
    console.log('PREFETCHING', page);
    return this.queryClient.prefetchQuery(['projects', page], () =>
      firstValueFrom(fetchProjects(page))
    );
  }

  destroy() {
    this.projectsObserver?.unsubscribe();
    this.projectsObserver = null;
  }

  private fetchProjects(page = 0) {
    return this.useQuery(
      ['projects', page] as const,
      ({ queryKey }) => fetchProjects(queryKey[1]),
      {
        keepPreviousData: true,
      }
    );
  }
}

function fetchProjects(nextPage: number) {
  const page = nextPage || 0;
  console.log('FETCHING ', nextPage);
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
