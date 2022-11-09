import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UseQuery } from '@ngneat/query';
import { SubscribeModule } from '@ngneat/subscribe';
import { switchMap, filter, ReplaySubject } from 'rxjs';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'ng-query-default-query-function-page',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgForOf, SubscribeModule],
  template: `
    <p>
      In this example we are creating queries by only supplying a query key
      while relying on defaultQueryFn defined in our QueryClientConfig.
    </p>
    <p>
      As you visit the posts below, you will notice them in a loading state the
      first time you load them. However, after you return to this list and click
      on any posts you have already visited again, you will see them load
      instantly and background refresh right before your eyes!
      <strong>
        (You may need to throttle your network speed to simulate longer loading
        sequences)
      </strong>
    </p>

    <ng-container *ngIf="selectedPostId$ | async; else postListTpl">
      <ng-container *subscribe="selectedPost$ as selectedPost">
        <button class="btn btn-link" (click)="selectedPostId$.next(null)">
          Back
        </button>
        <div class="p-4">
          <h2>{{ selectedPost.data?.title }}</h2>
          <p>{{ selectedPost.data?.body }}</p>
        </div>
      </ng-container>
    </ng-container>

    <ng-template #postListTpl>
      <ng-container *subscribe="posts$ as posts">
        <button
          *ngFor="let post of posts.data"
          class="btn btn-link block"
          (click)="selectedPostId$.next(post.id)"
        >
          {{ post.title }}
        </button>
      </ng-container>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultQueryFunctionPageComponent {
  useQuery = inject(UseQuery);
  selectedPostId$ = new ReplaySubject<number | null>(1);

  posts$ = this.useQuery<Post[]>(['/posts']).result$;
  selectedPost$ = this.selectedPostId$.asObservable().pipe(
    filter(Boolean),
    switchMap((id) => this.useQuery<Post>([`/posts/${id}`]).result$)
  );
}
