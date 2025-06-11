import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { TabComponent } from '../query-tab/tab.component';

@Component({
    selector: 'query-tabs',
    imports: [NgComponentOutlet],
    templateUrl: './tabs.component.html',
    styles: `
    .is-active-tab a {
      color: #b93eff;
      border-bottom-color: #b93eff;
    }
  `
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent, { read: TabComponent })
  tabs!: QueryList<TabComponent>;

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);
    if (activeTabs.length === 0) this.selectTab(this.tabs.first);
  }

  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach((tab) => (tab.active = false));
    tab.active = true;
  }
}
