import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-query-pagination-page',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>pagination-page works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
