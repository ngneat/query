import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from './posts.service';
import { InViewDirective } from './in-view.directive';

@Component({
  selector: 'query-posts-page',
  standalone: true,
  imports: [CommonModule, InViewDirective],
  templateUrl: './posts-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsPageComponent {
  posts$ = inject(PostsService).getPosts().result$;

  getBackground(id: number): string {
    return `hsla(${id * 30}, 60%, 80%, 1)`;
  }
}
