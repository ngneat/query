import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-query-mutations-page',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>mutations-page works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutationsPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
