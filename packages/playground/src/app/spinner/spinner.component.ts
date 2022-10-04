import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
