import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';

@Directive({
  selector: '[queryInView]',
  standalone: true,
})
export class InViewDirective implements AfterViewInit, OnDestroy {
  @Output() inView: EventEmitter<void> = new EventEmitter<void>();

  #intersectionObserver?: IntersectionObserver;
  elementRef = inject(ElementRef);

  ngAfterViewInit() {
    this.#intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.inView.emit();
        }
      });
    }, {});

    this.#intersectionObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    if (this.#intersectionObserver) {
      this.#intersectionObserver.disconnect();
    }
  }
}
