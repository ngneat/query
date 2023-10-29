import { inject, Injectable } from '@angular/core';
import {
  QueryClientService,
  queryOptions,
  UsePersistedQuery,
} from '@ngneat/query';
import { delay, firstValueFrom, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private queryClient = inject(QueryClientService);

  getProjects = inject(UsePersistedQuery)(
    (queryKey: ['projects', number], params) => {
      return queryOptions({
        queryKey,
        queryFn: ({ queryKey }) => {
          console.log(params);
          return fetchProjects(queryKey[1]);
        },
      });
    }
  );

  prefetch(page: number) {
    console.log('PREFETCHING', page);

    return this.queryClient.prefetchQuery({
      queryKey: ['projects', page],
      queryFn: ({ queryKey }) => firstValueFrom(fetchProjects(page))
    });
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
