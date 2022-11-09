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
    useInfiniteQuery(['key0'], infiniteFetcher(0), { staleTime: 1000 });
    expect(baseQuery).toBeCalledWith(client, InfiniteQueryObserver, {
      staleTime: 1000,
      queryKey: ['key0'],
      queryFn: expect.any(Function), // TODO: make it work with simpleFetcher function
    });
  });

  it('should return loading state initially', async () => {
    const query = useInfiniteQuery(['key1'], infiniteFetcher(0));

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    const [loading] = observerSpy.getValues();
    expect(loading.status).toBe('loading');
  });

  it('should resolve to success', async () => {
    const query = useInfiniteQuery(['key2'], infiniteFetcher(0));

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    const [_, success] = observerSpy.getValues();
    expect(success.data.pages.length).toBe(1);
  });

  it('should have hasPreviousPage and hasNextPage undefined', async () => {
    const query = useInfiniteQuery(['key3'], infiniteFetcher(0));

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    const [_, success] = observerSpy.getValues();
    expect(success.hasPreviousPage).toBe(undefined);
    expect(success.hasNextPage).toBe(undefined);
  });

  it('should have hasNextPage to be true', async () => {
    const query = useInfiniteQuery(['key4'], infiniteFetcher(0), {
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
    const query = useInfiniteQuery(['key5'], infiniteFetcher(100), {
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
    const query = useInfiniteQuery(['key6'], infiniteFetcher(0, pageSize), {
      getNextPageParam: (data) => {
        return data.nextId;
      },
    });

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    await query.fetchNextPage();

    expect(observerSpy.getValuesLength()).toBe(4);
    expect(observerSpy.getLastValue()?.data?.pageParams).toStrictEqual([
      undefined,
      pageSize,
    ]);
  });

  it('should fetch previous page', async () => {
    const pageSize = 5;
    const query = useInfiniteQuery(['key6'], infiniteFetcher(0, pageSize), {
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
      undefined,
    ]);
  });
});
