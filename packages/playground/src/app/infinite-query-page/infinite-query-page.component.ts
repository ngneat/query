import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubscribeModule } from '@ngneat/subscribe';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'ng-query-infinite-query-page',
  standalone: true,
  imports: [CommonModule, SubscribeModule],
  template: ` TBD `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteQueryPageComponent {
  projects = inject(ProjectsService);
}
