import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[ng-scroll]',
  standalone: true,
})
export class ScrollDirective {
  @Output() scrollEnd = new EventEmitter<void>();

  @HostListener('scroll', ['$event.target'])
  onScroll(target: HTMLElement) {
    const { scrollHeight, scrollTop, clientHeight } = target;
    const scroll = Math.ceil(scrollTop + clientHeight);
    if (scroll >= scrollHeight) {
      this.scrollEnd.emit();
    }
  }
}
