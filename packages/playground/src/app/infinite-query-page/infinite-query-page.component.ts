import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubscribeModule } from '@ngneat/subscribe';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PostsService } from './posts.service';

@Component({
  selector: 'ng-query-infinite-query-page',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, SubscribeModule],
  template: `
    <h2 class="mb-3">Todos</h2>

    <ng-container *subscribe="posts$ as posts">
      <ng-query-spinner
        *ngIf="posts.isLoading || posts.isFetchingNextPage"
      ></ng-query-spinner>

      <ul class="list-group" *ngIf="posts.isSuccess">
        <ng-container *ngFor="let page of posts.data.pages">
          <li class="list-group-item" *ngFor="let post of page">
            {{ post.title }}
          </li>
        </ng-container>
      </ul>
      <section class="flex mt-4 gap-3 justify-center items-center">
        <button
          type="button"
          (click)="posts.fetchNextPage()"
          class="btn btn-info"
        >
          Load more posts
        </button>
      </section>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteQueryPageComponent {
  postsService = inject(PostsService);

  posts$ = this.postsService.getPosts();
}
