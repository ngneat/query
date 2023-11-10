import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { PaginationService } from './pagination-service';

@Component({
  selector: 'query-pagination-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-page.component.html',
  styleUrls: ['./pagination-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationPageComponent {
  #page = new BehaviorSubject(0);
  page$ = this.#page.asObservable();
  projectsService = inject(PaginationService);

  projects$ = this.page$.pipe(
    switchMap((page) => {
      return this.projectsService.getProjects(page).result$.pipe(
        tap((result) => {
          result.data?.hasMore && this.projectsService.prefetch(page + 1);
        })
      );
    })
  );

  nextPage() {
    this.#page.next(this.#page.getValue() + 1);
  }

  prevPage() {
    this.#page.next(this.#page.getValue() - 1);
  }

  trackBy(_: number, project: { id: number }) {
    return project.id;
  }
}
