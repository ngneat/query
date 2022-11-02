import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubscribeModule } from '@ngneat/subscribe';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ProjectsService } from './projects.service';
import { ScrollDirective } from './scroll.directive';

@Component({
  selector: 'ng-query-infinite-query-page',
  standalone: true,
  imports: [NgIf, NgForOf, SpinnerComponent, SubscribeModule, ScrollDirective],
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
      }
    `,
  ],
  template: `
    <h2 class="mb-3">Projects</h2>

    <div
      class="w-100 flex flex-col overflow-auto"
      style="    height: calc(100vh - 56px)"
      *subscribe="projects$ as projects"
      (scrollEnd)="projects.hasNextPage && projects.fetchNextPage()"
      ng-scroll
    >
      <section class="flex mt-4 gap-3 justify-center items-center">
        <button
          type="button"
          (click)="projects.fetchPreviousPage()"
          *ngIf="!projects.isLoading"
          class="btn btn-info"
          [disabled]="!projects.hasPreviousPage"
        >
          Load previous projects
        </button>
      </section>

      <ng-query-spinner
        class="mx-auto"
        *ngIf="projects.isFetchingPreviousPage"
      ></ng-query-spinner>

      <ul class="list-group" *ngIf="projects.isSuccess">
        <ng-container *ngFor="let page of projects.data.pages">
          <li
            class="list-group-item h-56 flex items-center rounded my-10"
            [style.background]="'hsla(' + project.id * 30 + ', 60%, 80%, 1)'"
            *ngFor="let project of page.data"
          >
            {{ project.name }}
          </li>
        </ng-container>
      </ul>

      <ng-query-spinner
        class="mx-auto min-h-[150px] flex items-center"
        *ngIf="projects.isFetchingNextPage || projects.isLoading"
      ></ng-query-spinner>

      <div
        class="alert alert-danger flex justify-center"
        role="alert"
        *ngIf="!projects.hasNextPage && !projects.isLoading"
      >
        Nothing more to load
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteQueryPageComponent {
  projectsService = inject(ProjectsService);
  projects$ = this.projectsService.getProjects().result$;
}
