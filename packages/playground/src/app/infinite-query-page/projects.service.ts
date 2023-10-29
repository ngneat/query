import { inject, Injectable } from '@angular/core';
import { UseInfiniteQuery } from '@ngneat/query';
import { Observable } from 'rxjs';
interface Project {
  id: number;
  name: string;
}

export interface Projects {
  data: Project[];
  nextId: number | null;
  previousId: number | null;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private useInfiniteQuery = inject(UseInfiniteQuery);
  getProjects() {
    return this.useInfiniteQuery({
      queryKey: ['projects'],
      initialPageParam: 0,
      queryFn: ({ pageParam }) => getProjects(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextId,
      getPreviousPageParam: (firstPage) => firstPage.previousId
  });
  }
}

function getProjects(c: number) {
  return new Observable<Projects>((observer) => {
    const cursor: number = c || 0;
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
