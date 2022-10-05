import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-query-infinite-query-page',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>infinite-query-page works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteQueryPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
