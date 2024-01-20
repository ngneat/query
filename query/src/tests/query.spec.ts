import { Injector, effect, runInInjectionContext } from '@angular/core';
import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { expectTypeOf } from 'expect-type';
import { Todo, TodosService } from './test-helper';

describe('query', () => {
  let service: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodosService],
    });
    service = TestBed.inject(TodosService);
  });

  it('should work', fakeAsync(() => {
    const spy = jest.fn();

    const sub = service.getTodos().result$.subscribe((v) => {
      spy(v.status);
      expectTypeOf(v.data).toEqualTypeOf<Todo[] | undefined>();
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('pending');
    tick(1000);
    flush();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('success');

    sub.unsubscribe();
    flush();
  }));

  it('should work with signals', fakeAsync(() => {
    const spy = jest.fn();

    runInInjectionContext(TestBed.inject(Injector), () => {
      const result = service.getTodos().result;
      expectTypeOf(result().data).toEqualTypeOf<Todo[] | undefined>();

      effect(() => {
        spy(result().status);
      });
    });

    TestBed.flushEffects();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('pending');
    tick(1000);
    flush();
    TestBed.flushEffects();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('success');
  }));
});
