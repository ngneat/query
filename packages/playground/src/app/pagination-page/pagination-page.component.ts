import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubscribeModule } from '@ngneat/subscribe';
import { PaginatedProject } from '../types/project';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'ng-query-pagination-page',
  standalone: true,
  imports: [CommonModule, SubscribeModule],
  template: `
    <p>
      In this example, each page of data remains visible as the next page is
      fetched. The buttons and capability to proceed to the next page are also
      supressed until the next page cursor is known. Each page is cached as a
      normal query too, so when going to previous pages, you'll see them
      instantaneously while they are also refetched invisibly in the background.
    </p>
    <div *subscribe="projects$ as projects">
      <ng-container [ngSwitch]="projects.status">
        <div *ngSwitchCase="'loading'">Loading...</div>
        <div *ngSwitchCase="'error'">
          An error has occurred: {{ projects.error }}
        </div>
        <ng-container *ngSwitchDefault>
          <div *ngFor="let project of projects.data?.projects">
            <p>{{ project.name }}</p>
          </div>
        </ng-container>
      </ng-container>
      <div>Current Page: {{ page + 1 }}</div>
      <button
        class="btn btn-outline-primary mr-2"
        (click)="previousPage()"
        [disabled]="page === 0"
      >
        Previous Page
      </button>
      <button
        class="btn btn-outline-primary"
        (click)="nextPage(projects.data)"
        [disabled]="projects.isPreviousData || !projects.data?.hasMore"
      >
        Next Page
      </button>
      <span *ngIf="projects.isFetching"> Loading...</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationPageComponent {
  page = 0;
  projectsService = inject(ProjectsService);
  projects$ = this.projectsService.getProjects(this.page);

  triggerFetch() {
    this.projects$ = this.projectsService.getProjects(this.page);
  }

  previousPage() {
    this.page = Math.max(0, this.page - 1);
    this.triggerFetch();
  }

  nextPage(data: PaginatedProject | undefined) {
    this.page = data?.hasMore ? this.page + 1 : this.page;
    this.triggerFetch();
  }
}
