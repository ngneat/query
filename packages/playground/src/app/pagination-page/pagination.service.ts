import { inject, Injectable } from '@angular/core';
import {
  NgQueryObserverReturnType,
  QueryClient,
  QueryProvider,
} from '@ngneat/ng-query';
import { delay, firstValueFrom, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private queryClient = inject(QueryClient);
  private useQuery = inject(QueryProvider);
  private observer: NgQueryObserverReturnType<
    Projects,
    unknown,
    Projects,
    readonly ['projects', number]
  > | null = null;

  getProjects(page = 0) {
    if (!this.observer) {
      this.observer = this.useQuery(
        ['projects', page] as const,
        ({ queryKey }) => fetchProjects(queryKey[1]),
        {
          keepPreviousData: true,
        }
      );

      return this.observer;
    }

    // TODO: FIND A WAY TO WRAP EVERTHING
    const defaultedOptions = this.queryClient.defaultQueryOptions({
      queryKey: ['projects', page],
    });

    this.observer.setOptions({
      ...this.observer.options,
      ...defaultedOptions,
    } as any);

    return this.observer;
  }

  prefetch(page: number) {
    console.log('PREFETCHING', page);
    return this.queryClient.prefetchQuery(['projects', page], () =>
      firstValueFrom(fetchProjects(page))
    );
  }

  destroy() {
    this.observer?.unsubscribe();
    this.observer = null;
  }
}

interface Projects {
  projects: Array<{ name: string; id: number }>;
  hasMore: boolean;
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
