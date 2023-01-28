import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { QueryClientService } from '@ngneat/query';
import { BehaviorSubject, delay, filter, switchMap } from 'rxjs';
import { Post, PostsService } from '../posts.service';

@Component({
  selector: 'ng-query-placeholder-data-from-cache',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, NgIf],
  template: `
    <div class="w-full max-w-full" *ngIf="posts$ | async">
      <div
        class="rounded-md font-normal w-full border border-gray-200 p-4"
        *ngIf="post$ | async as post"
      >
        <div class="flex">
          <button (click)="nextPost()" class="btn btn-info">
            fetch next post
          </button>
          <span
            class="bg-orange-300 border-2 border-solid border-orange-400 flex items-center ml-4 px-2"
            *ngIf="post.isPlaceholderData"
            >placeholder data from cache</span
          >
          <span
            class="bg-green-300 border-2 border-solid border-green-400 flex items-center ml-4 px-2"
            *ngIf="post.isSuccess && !post.isPlaceholderData"
            >loaded data from server</span
          >
        </div>
        <h2>{{ post?.data?.title }}</h2>
        <p>{{ post?.data?.body }}</p>
      </div>
    </div>
  `,
})
export class PlaceholderDataFromCacheComponent {
  private postsService = inject(PostsService);
  private queryClient = inject(QueryClientService);
  posts$ = this.postsService.getAll().result$.pipe(filter((r) => r.isSuccess));
  postSubject = new BehaviorSubject<number>(50);
  post$ = this.postSubject
    .asObservable()
    .pipe(switchMap((id) => this.getPost(id).result$));

  get placeholderData() {
    return this.queryClient
      .getQueryData<Post[]>(['posts'])
      ?.find((p) => p.id === this.postSubject.value);
  }

  get options() {
    return {
      placeholderData: this.placeholderData,
    };
  }

  getPost(id: number) {
    return this.postsService.get(id, this.options, delay(2000));
  }

  nextPost() {
    this.postSubject.next(this.postSubject.value + 1);
  }
}
