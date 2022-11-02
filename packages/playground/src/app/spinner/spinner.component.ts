import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ng-query-spinner',
  standalone: true,
  template: `
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}
