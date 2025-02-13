import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { InfiniteData, QueryClient as _QueryClient } from '@tanstack/query-core';
import { expectTypeOf } from 'expect-type';
import { QueryClient, injectQueryClient, provideQueryClient } from '../lib/query-client';
import {
  Posts,
  PostsService,
  Todo,
  TodosService,
  getObservablePostsQuery,
  getObservableTodosQuery,
  getPromisePostsQuery,
  getPromiseTodosQuery,
} from './test-helper';

describe('QueryClient', () => {
  let queryClient: QueryClient;
  let todoService: TodosService;
  let postsService: PostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodosService, PostsService],
    });

    todoService = TestBed.inject(TodosService);
    postsService = TestBed.inject(PostsService);
    TestBed.runInInjectionContext(() => {
      queryClient = injectQueryClient();
    });
  });

  it('fetchQuery should work with observable queryFn', fakeAsync(() => {
    queryClient.fetchQuery(getObservableTodosQuery()).then((v) => {
      expectTypeOf(v).toEqualTypeOf<Todo[]>();
    });

    tick(1000);
    flush();
  }));
  it('fetchQuery should work with promise queryFn', fakeAsync(() => {
    queryClient.fetchQuery(getPromiseTodosQuery()).then((v) => {
      expectTypeOf(v).toEqualTypeOf<Todo[]>();
    });

    tick(1000);
    flush();
  }));

  it('prefetchQuery should work with observable queryFn', fakeAsync(() => {
    queryClient.prefetchQuery(getObservableTodosQuery());

    tick(1000);

    const data = todoService.getCachedTodos();
    expectTypeOf(data).toEqualTypeOf<Todo[] | undefined>();

    flush();
  }));
  it('prefetchQuery should work with promise queryFn', fakeAsync(() => {
    queryClient.prefetchQuery(getPromiseTodosQuery());

    tick(1000);

    const data = todoService.getCachedTodos();
    expectTypeOf(data).toEqualTypeOf<Todo[] | undefined>();

    flush();
  }));

  it('ensureQueryData should work with observable queryFn', fakeAsync(() => {
    queryClient.ensureQueryData(getObservableTodosQuery()).then((v) => {
      expectTypeOf(v).toEqualTypeOf<Todo[]>();
    });

    tick(1000);
    flush();
  }));
  it('ensureQueryData should work with promise queryFn', fakeAsync(() => {
    queryClient.ensureQueryData(getPromiseTodosQuery()).then((v) => {
      expectTypeOf(v).toEqualTypeOf<Todo[]>();
    });

    tick(1000);
    flush();
  }));

  it('fetchInfiniteQuery should work with observable queryFn', fakeAsync(() => {
    queryClient.fetchInfiniteQuery(getObservablePostsQuery()).then((v) => {
      expectTypeOf(v).toEqualTypeOf<InfiniteData<Posts, number>>();
    });

    tick(1000);
    flush();
  }));
  it('fetchInfiniteQuery should work with promise queryFn', fakeAsync(() => {
    queryClient.fetchInfiniteQuery(getPromisePostsQuery()).then((v) => {
      expectTypeOf(v).toEqualTypeOf<InfiniteData<Posts, number>>();
    });

    tick(1000);
    flush();
  }));

  it('prefetchInfiniteQuery should work with observable queryFn', fakeAsync(() => {
    queryClient.prefetchInfiniteQuery(getObservablePostsQuery());

    tick(1000);

    const data = postsService.getCachedPosts();
    expectTypeOf(data).toEqualTypeOf<Posts | undefined>();

    flush();
  }));
  it('prefetchInfiniteQuery should work with promise queryFn', fakeAsync(() => {
    queryClient.prefetchInfiniteQuery(getPromisePostsQuery());

    tick(5000);

    const data = postsService.getCachedPosts();
    expectTypeOf(data).toEqualTypeOf<Posts | undefined>();

    flush();
  }));

  it('should be typed', () => {
    expectTypeOf(todoService.getCachedTodos()).toEqualTypeOf<
      Todo[] | undefined
    >();
  });

  it('should be typed', () => {
    expectTypeOf(postsService.getCachedPosts()).toEqualTypeOf<
      Posts | undefined
    >();
  });
});


describe('Custom QueryClient', () => {
  let queryClient: QueryClient;
  let customQueryClientInstance: _QueryClient;

  it('should use custom query client', fakeAsync(() => {
    customQueryClientInstance = new _QueryClient();
    TestBed.configureTestingModule({
      providers: [provideQueryClient(customQueryClientInstance)],
    });
    TestBed.runInInjectionContext(() => {
      queryClient = injectQueryClient();
    });

    expect(queryClient).toBe(customQueryClientInstance);
  }));

  it('should use custom query client provided from function', fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideQueryClient(() => {
          customQueryClientInstance = new _QueryClient();
          return customQueryClientInstance;
        }),
      ],
    });
    TestBed.runInInjectionContext(() => {
      queryClient = injectQueryClient();
    });

    expect(queryClient).toBe(customQueryClientInstance);
  }));

});

