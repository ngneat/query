import { inject, Injectable } from '@angular/core';
import { QueryProvider } from '@ngneat/ng-query';
import { Observable } from 'rxjs';
import { PaginatedProject } from '../types/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private useQuery = inject(QueryProvider);

  getProjects(page: number) {
    return this.useQuery(['projects', page], () => getProjects(page), {
      keepPreviousData: true,
      staleTime: 5000,
    });
  }
}

const PAGE_SIZE = 10;
function getProjects(page: number) {
  return new Observable<PaginatedProject>((observer) => {
    const projects = Array(PAGE_SIZE)
      .fill(0)
      .map((_, i) => {
        const id = page * PAGE_SIZE + (i + 1);
        return {
          name: 'Project ' + id,
          id,
        };
      });

    setTimeout(() => {
      observer.next({
        projects,
        hasMore: page < 9,
      });
      observer.complete();
    }, 1000);
  });
}
