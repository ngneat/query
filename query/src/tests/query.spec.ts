import { effect, Injector, runInInjectionContext, Signal } from '@angular/core';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { expectTypeOf } from 'expect-type';
import {
  DefaultError,
  QueryKey,
  QueryObserverResult,
} from '@tanstack/query-core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo, TodosService } from './test-helper';
import { injectQuery } from '../lib/query';
import { UndefinedInitialDataOptions } from '../lib/query-options';
import { Result } from '../lib/types';
import { provideQueryConfig } from '../lib/provide-query-config';

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

describe('Custom Query', () => {
  const mockResultInitial = {
    status: 'success',
    error: null,
    isPending: false,
    isSuccess: true,
    isError: false,
    isFetching: false,
    isStale: true,
  };
  const result$ = new BehaviorSubject<
    typeof mockResultInitial & { options?: unknown }
  >(mockResultInitial);
  const result = () => result$.getValue();
  const queryMock = {
    use<
      TQueryFnData = unknown,
      TError = DefaultError,
      TData = TQueryFnData,
      TQueryKey extends QueryKey = QueryKey,
    >(
      options: UndefinedInitialDataOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryKey
      >,
    ): Result<QueryObserverResult<TData, TError>> {
      result$.next({ ...mockResultInitial, options });
      return {
        result: result as Signal<QueryObserverResult<TData, TError>>,
        result$: result$.asObservable() as Observable<
          QueryObserverResult<TData, TError>
        >,
        updateOptions: <
          TQueryFnData,
          TError,
          TData,
          TQueryKey extends QueryKey,
        >(
          options2: UndefinedInitialDataOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryKey
          >,
        ) => {
          result$.next({ ...result$.getValue(), options: options2 });
        },
      };
    },
  };

  it('should use custom query', (done) => {
    TestBed.configureTestingModule({
      providers: [provideQueryConfig({ query: queryMock })],
    });
    const query = TestBed.runInInjectionContext(() => injectQuery());

    const queryOptions = {
      queryKey: ['test1', 'test3'],
      queryFn: () => 'test2',
    };
    const queryResult = query(queryOptions);
    expect(queryResult.result()).toEqual({
      ...mockResultInitial,
      options: queryOptions,
    });
    queryResult.result$.subscribe((result: QueryObserverResult) => {
      expect(result).toMatchObject(mockResultInitial);
      expect(
        'options' in result &&
          'queryKey' in (result.options as object) &&
          (result.options as typeof queryOptions).queryKey,
      ).toEqual(['test1', 'test3']);
      expect(
        'options' in result &&
          'queryFn' in (result.options as object) &&
          (result.options as typeof queryOptions).queryFn(),
      ).toEqual('test2');
      done();
    });
  });

  it('should use custom query client provided from function', (done) => {
    TestBed.configureTestingModule({
      providers: [provideQueryConfig({ query: () => queryMock })],
    });
    const query = TestBed.runInInjectionContext(() => injectQuery());

    const queryOptions = {
      queryKey: ['test1', 'test2'],
      queryFn: () => 'test3',
    };
    const queryResult = query(queryOptions);

    expect(queryResult.result()).toEqual({
      ...mockResultInitial,
      options: queryOptions,
    });
    queryResult.result$.subscribe((result) => {
      expect(result).toMatchObject(mockResultInitial);
      expect(
        'options' in result &&
          'queryKey' in (result.options as object) &&
          (result.options as typeof queryOptions).queryKey,
      ).toEqual(['test1', 'test2']);
      expect(
        'options' in result &&
          'queryFn' in (result.options as object) &&
          (result.options as typeof queryOptions).queryFn(),
      ).toEqual('test3');
      done();
    });
  });
});
