import { Component, Input } from '@angular/core';

@Component({
    selector: 'query-tab',
    imports: [],
    templateUrl: './tab.component.html',
    styles: ''
})
export class TabComponent {
  @Input({ required: true }) title = '';
  public active: boolean = false;
}
