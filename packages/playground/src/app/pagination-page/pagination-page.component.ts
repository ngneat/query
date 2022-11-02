import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubscribeModule } from '@ngneat/subscribe';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PaginationService } from './pagination.service';

@Component({
  selector: 'ng-query-pagination-page',
  standalone: true,
  imports: [NgIf, NgForOf, SubscribeModule, SpinnerComponent],
  template: `
    <p>
      In this example, each page of data remains visible as the next page is
      fetched. The buttons and capability to proceed to the next page are also
      supressed until the next page cursor is known. Each page is cached as a
      normal query too, so when going to previous pages, you'll see them
      instantaneously while they are also refetched invisibly in the background.
    </p>

    <ng-container *subscribe="projects$ as projects">
      <ng-query-spinner *ngIf="projects.isLoading"></ng-query-spinner>

      <ul class="list-group" *ngIf="projects.isSuccess">
        <li
          class="list-group-item"
          *ngFor="let project of projects.data.projects; trackBy: trackBy"
        >
          {{ project.name }}
        </li>
      </ul>

      <div class="flex items-center">
        <button
          (click)="prevPage()"
          [disabled]="page === 0"
          *subscribe="page$ as page"
        >
          Previous Page
        </button>

        <button
          (click)="nextPage()"
          [disabled]="projects.isPreviousData || !projects.data?.hasMore"
        >
          Next Page
        </button>
        {{ projects.isFetching ? 'Loading...' : '' }}
      </div>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationPageComponent {
  private page = new BehaviorSubject(0);
  page$ = this.page.asObservable();
  projectsService = inject(PaginationService);

  projects$ = this.page$.pipe(
    switchMap((page) => {
      return this.projectsService
        .getProjects(['projects', page], { foo: Math.random() })
        .result$.pipe(
          tap((result) => {
            result.data?.hasMore && this.projectsService.prefetch(page + 1);
          })
        );
    })
  );

  nextPage() {
    this.page.next(this.page.getValue() + 1);
  }

  prevPage() {
    this.page.next(this.page.getValue() - 1);
  }

  trackBy(_: number, project: { id: number }) {
    return project.id;
  }
}
