import {
  Injectable,
  Injector,
  effect,
  runInInjectionContext,
} from '@angular/core';
import { injectQuery } from '../lib/query';
import { injectQueryClient } from '../lib/query-client';
import { queryOptions } from '../lib/query-options';
import { expectTypeOf } from 'expect-type';
import { map, timer } from 'rxjs';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

interface Todo {
  id: number;
}

@Injectable({ providedIn: 'root' })
class TodosService {
  #client = injectQueryClient();
  #query = injectQuery();

  #getTodosOptions = queryOptions({
    queryKey: ['todos'] as const,
    queryFn: () => {
      return timer(1000).pipe(
        map(() => {
          return [
            {
              id: 1,
            },
            { id: 2 },
          ] as Todo[];
        }),
      );
    },
  });

  getTodos() {
    return this.#query(this.#getTodosOptions);
  }

  getCachedTodos() {
    return this.#client.getQueryData(this.#getTodosOptions.queryKey);
  }
}

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

  it('should be typed', () => {
    expectTypeOf(service.getCachedTodos()).toEqualTypeOf<Todo[] | undefined>();
  });
});
