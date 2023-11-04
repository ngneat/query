import { UseInfiniteQuery } from '../infinite-query';
import { TestBed } from '@angular/core/testing';
import { QueryClientService } from '../query-client';
import {
  InfiniteQueryObserver,
  QueryClient as QueryCore,
} from '@tanstack/query-core';
import { flushPromises, infiniteFetcher } from './test-utils';
import { baseQuery } from '../base-query';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
jest.mock('../base-query');

describe('useQuery', () => {
  let useInfiniteQuery: UseInfiniteQuery;
  let client: QueryCore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    useInfiniteQuery = TestBed.inject(UseInfiniteQuery);
    client = TestBed.inject(QueryClientService);
  });

  it('should be defined', async () => {
    expect(useInfiniteQuery).toBeTruthy();
  });

  it('should properly execute query', () => {
    useInfiniteQuery({
      queryKey: ['key0'],
      queryFn: infiniteFetcher(0),
      staleTime: 1000,
      initialPageParam: 0,
      getNextPageParam: (data) => {
        return data.nextId;
      },
    });
    expect(baseQuery).toBeCalledWith(client, InfiniteQueryObserver, {
      staleTime: 1000,
      queryKey: ['key0'],
      queryFn: expect.any(Function), // TODO: make it work with simpleFetcher function
      initialPageParam: 0,
      getNextPageParam: expect.any(Function),
    });
  });

  it('should return pending state initially', async () => {
    const query = useInfiniteQuery({
      queryKey: ['key1'],
      queryFn: infiniteFetcher(0),
      initialPageParam: 0,
      getNextPageParam: (data) => {
        return data.nextId;
      },
    });

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    const [loading] = observerSpy.getValues();
    expect(loading.status).toBe('pending');
  });

  it('should resolve to success', async () => {
    const query = useInfiniteQuery({
      queryKey: ['key2'],
      queryFn: infiniteFetcher(0),
      initialPageParam: 0,
      getNextPageParam: (data) => {
        return data.nextId;
      },
    });

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    const [_, success] = observerSpy.getValues();
    expect(success.data.pages.length).toBe(1);
  });

  it('should have hasPreviousPage to be false', async () => {
    const query = useInfiniteQuery({
      queryKey: ['key3'],
      queryFn: infiniteFetcher(0),
      initialPageParam: 0,
      getNextPageParam: (data) => data.nextId,
    });

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    const [_, success] = observerSpy.getValues();
    expect(success.hasPreviousPage).toBe(false);
    expect(success.hasNextPage).toBe(true);
  });

  it('should have hasNextPage to be true', async () => {
    const query = useInfiniteQuery({
      queryKey: ['key4'],
      queryFn: infiniteFetcher(0),
      initialPageParam: 0,
      getNextPageParam: (data) => {
        return data.nextId;
      },
    });

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    const [_, success] = observerSpy.getValues();
    expect(success.hasNextPage).toBe(true);
  });

  it('should have hasNextPage to be false', async () => {
    const query = useInfiniteQuery({
      queryKey: ['key5'],
      queryFn: infiniteFetcher(100),
      initialPageParam: 0,
      getNextPageParam: (data) => {
        return data.nextId;
      },
    });

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    const [_, success] = observerSpy.getValues();
    expect(success.hasNextPage).toBe(false);
  });

  it('should fetch next page', async () => {
    const pageSize = 5;
    const query = useInfiniteQuery({
      queryKey: ['key6'],
      queryFn: infiniteFetcher(0, pageSize),
      initialPageParam: 0,
      getNextPageParam: (data) => {
        return data.nextId;
      },
    });

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    await query.fetchNextPage();

    expect(observerSpy.getValuesLength()).toBe(4);
    expect(observerSpy.getLastValue()?.data?.pageParams).toStrictEqual([
      0,
      pageSize,
    ]);
  });

  it('should fetch previous page', async () => {
    const pageSize = 5;
    const query = useInfiniteQuery({
      queryKey: ['key7'],
      queryFn: infiniteFetcher(0, pageSize),
      initialPageParam: 0,
      getNextPageParam: (data) => {
        return data.nextId;
      },
      getPreviousPageParam: (data) => {
        return data.previousId;
      },
    });

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    await query.fetchPreviousPage();

    expect(observerSpy.getValuesLength()).toBe(4);
    expect(observerSpy.getLastValue()?.data?.pageParams).toStrictEqual([
      -pageSize,
      0,
    ]);
  });
});
