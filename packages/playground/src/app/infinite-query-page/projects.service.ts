import { inject, Injectable } from '@angular/core';
import { InfiniteQueryProvider } from '@ngneat/ng-query';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private useInfiniteQuery = inject(InfiniteQueryProvider);

  getProjects() {}
}

function getProjects(c: string) {
  return new Observable<{
    data: { id: number; name: string }[];
    nextId: number | null;
    previousId: number | null;
  }>((observer) => {
    const cursor = parseInt(c) || 0;
    const pageSize = 5;

    const data = Array(pageSize)
      .fill(0)
      .map((_, i) => {
        return {
          name: 'Project ' + (i + cursor) + ` (server time: ${Date.now()})`,
          id: i + cursor,
        };
      });

    const nextId = cursor < 10 ? data[data.length - 1].id + 1 : null;
    const previousId = cursor > -10 ? data[0].id - pageSize : null;

    setTimeout(() => {
      observer.next({ data, nextId, previousId });
      observer.complete();
    }, 1000);
  });
}
