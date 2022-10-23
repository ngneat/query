import { QueryProvider, UseQuery } from '../query';
import { TestBed } from '@angular/core/testing';
import {
  fetcher,
  flushPromises,
  rejectFetcher,
  simpleFetcher,
} from './test-utils';
import { QueryClient } from '../query-client';
import { QueryClient as QueryCore } from '@tanstack/query-core';
import { QueryObserver } from '@tanstack/query-core';
import { baseQuery } from '../base-query';
import { skip, firstValueFrom } from 'rxjs';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
jest.mock('../base-query');

describe('useQuery', () => {
  let useQuery: UseQuery;
  let client: QueryCore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    useQuery = TestBed.inject(QueryProvider);
    client = TestBed.inject(QueryClient);
  });

  it('should properly execute query', () => {
    useQuery(['key0'], simpleFetcher, { staleTime: 1000 });
    expect(baseQuery).toBeCalledWith(client, QueryObserver, {
      staleTime: 1000,
      queryKey: ['key0'],
      queryFn: expect.any(Function), // TODO: make it work with simpleFetcher function
    });
  });

  it('should return loading status initially', () => {
    const query = useQuery(['key1'], simpleFetcher);

    expect(query.getCurrentResult()).toMatchObject({
      status: 'loading',
      isLoading: true,
      isFetching: true,
      isStale: true,
    });
  });

  it('should resolve to success: useQuery(key, dataFn)', async () => {
    const query = useQuery(['key2'], fetcher('result2'));

    const observerSpy = subscribeSpyTo(query.result$);
    await flushPromises();
    const [loading, success] = observerSpy.getValues();
    expect(loading.status).toBe('loading');
    expect(success).toMatchObject({
      status: 'success',
      data: 'result2',
      isLoading: false,
      isFetching: false,
      isFetched: true,
      isSuccess: true,
    });
  });

  it('should resolve to success: useQuery(optionsObj)', async () => {
    const query = useQuery({
      queryKey: ['key31'],
      queryFn: fetcher('result31'),
      enabled: true,
    });

    const result = await firstValueFrom(query.result$.pipe(skip(1)));
    expect(result).toMatchObject({
      status: 'success',
      data: 'result31',
      isLoading: false,
      isFetching: false,
      isFetched: true,
      isSuccess: true,
    });
  });

  it('should resolve to success: useQuery(key,optionsObj)', async () => {
    const query = useQuery(['key32'], {
      queryFn: fetcher('result32'),
      enabled: true,
    });

    const result = await firstValueFrom(query.result$.pipe(skip(1)));
    expect(result).toMatchObject({
      status: 'success',
      data: 'result32',
      isLoading: false,
      isFetching: false,
      isFetched: true,
      isSuccess: true,
    });
  });

  it.skip('should reject if queryFn errors out', async () => {
    const query = useQuery(['key3'], rejectFetcher<string>());

    const result = await firstValueFrom(query.result$.pipe(skip(1)));

    expect(result).toMatchObject({
      status: 'error',
      data: undefined,
      error: { message: 'Some error' },
      isLoading: false,
      isFetching: false,
      isFetched: true,
      isError: true,
      failureCount: 1,
      failureReason: { message: 'Some error' },
    });
  });

  it.skip('should call onSuccess callback', async () => {
    const onSuccess = jest.fn();

    useQuery(['key6'], simpleFetcher, {
      onSuccess,
      staleTime: 1000,
    });

    expect(onSuccess).toBeCalledTimes(1);
  });

  it.skip('should update query on reactive (Ref) key change', async () => {
    // do we expect query to be updated if key changes ?
  });
});
