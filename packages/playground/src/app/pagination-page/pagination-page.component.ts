import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ProjectsService } from '../infinite-query-page/projects.service';
import { SubscribeModule } from '@ngneat/subscribe';

@Component({
  selector: 'ng-query-pagination-page',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, SubscribeModule],
  template: `
    <h2 class="mb-3">Projects</h2>

    <ng-container *subscribe="projects$ as projects">
      <ng-query-spinner *ngIf="projects.isLoading"></ng-query-spinner>

      <ul class="list-group" *ngIf="projects.isSuccess">
        <li class="list-group-item" *ngFor="let project of projects.data.data">
          {{ project.name }}
        </li>
      </ul>
      <nav
        aria-label="Page navigation example"
        class="w-full flex justify-center mt-10"
      >
        <ul class="pagination">
          <li class="page-item">
            <a
              class="page-link"
              [class.disabled]="page === 0"
              (click)="previousPage()"
              >Previous</a
            >
          </li>
          <li class="page-item">
            <a
              class="page-link"
              [class.disabled]="!projects.data?.hasMore"
              (click)="nextPage()"
              >Next</a
            >
          </li>
        </ul>
      </nav>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationPageComponent {
  projectsService = inject(ProjectsService);
  projects$ = this.projectsService.getProjects();
  page = 0;
  nextPage() {
    this.page++;
    this.projects$ = this.projectsService.getProjects(this.page);
  }
  previousPage() {
    this.page--;
    this.projects$ = this.projectsService.getProjects(this.page);
  }
}
